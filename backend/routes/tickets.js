const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sonabel-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, token non fourni'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du token'
    });
  }
};

// Create a new ticket
router.post('/', verifyToken, async (req, res) => {
  const { queueDate, queueTime } = req.body;
  const userId = req.user.id;
  
  try {
    const db = req.app.locals.db;
    
    // Check if user already has an active ticket
    const [existingTickets] = await db.query(
      'SELECT * FROM tickets WHERE user_id = ? AND status IN ("pending", "active") AND queue_date >= CURRENT_DATE()',
      [userId]
    );
    
    if (existingTickets.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà un ticket actif'
      });
    }
    
    // Get current maximum queue position for the requested date and time
    const [maxPositionResult] = await db.query(
      'SELECT MAX(queue_position) as maxPosition FROM tickets WHERE queue_date = ? AND queue_time = ?',
      [queueDate, queueTime]
    );
    
    const nextPosition = (maxPositionResult[0].maxPosition || 0) + 1;
    
    // Create ticket
    const [result] = await db.query(
      `INSERT INTO tickets 
       (user_id, queue_date, queue_time, queue_position, status, created_at) 
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [userId, queueDate, queueTime, nextPosition]
    );
    
    // Get estimated wait time based on position (5 minutes per person)
    const estimatedWaitTime = `${nextPosition * 5} min`;
    
    res.status(201).json({
      success: true,
      message: 'Ticket créé avec succès',
      ticket: {
        id: result.insertId,
        queueDate,
        queueTime,
        queuePosition: nextPosition,
        status: 'pending',
        estimatedWaitTime
      }
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du ticket'
    });
  }
});

// Get user's active ticket
router.get('/active', verifyToken, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const db = req.app.locals.db;
    
    // Get user's active ticket
    const [tickets] = await db.query(
      `SELECT t.*, 
              DATE_FORMAT(t.queue_date, '%d %M %Y') as formatted_date,
              TIME_FORMAT(t.queue_time, '%H:%i') as formatted_time
       FROM tickets t 
       WHERE t.user_id = ? AND t.status IN ('pending', 'active') 
       AND t.queue_date >= CURRENT_DATE()
       ORDER BY t.queue_date ASC, t.queue_time ASC
       LIMIT 1`,
      [userId]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun ticket actif trouvé'
      });
    }
    
    const ticket = tickets[0];
    
    // Calculate estimated wait time (5 minutes per person)
    const estimatedWaitTime = `${ticket.queue_position * 5} min`;
    
    res.json({
      success: true,
      ticket: {
        id: ticket.id,
        queueDate: ticket.queue_date,
        queueTime: ticket.queue_time,
        formattedDate: ticket.formatted_date,
        formattedTime: ticket.formatted_time,
        queuePosition: ticket.queue_position,
        status: ticket.status,
        estimatedWaitTime,
        createdAt: ticket.created_at
      }
    });
  } catch (error) {
    console.error('Get active ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du ticket actif'
    });
  }
});

// Get user's ticket history
router.get('/history', verifyToken, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const db = req.app.locals.db;
    
    // Get user's ticket history
    const [tickets] = await db.query(
      `SELECT t.*, 
              DATE_FORMAT(t.queue_date, '%d %M %Y') as formatted_date,
              TIME_FORMAT(t.queue_time, '%H:%i') as formatted_time
       FROM tickets t 
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC
       LIMIT 10`,
      [userId]
    );
    
    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      queueDate: ticket.queue_date,
      queueTime: ticket.queue_time,
      formattedDate: ticket.formatted_date,
      formattedTime: ticket.formatted_time,
      queuePosition: ticket.queue_position,
      status: ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));
    
    res.json({
      success: true,
      tickets: formattedTickets
    });
  } catch (error) {
    console.error('Get ticket history error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique des tickets'
    });
  }
});

// Get available time slots for a specific date
router.get('/available-slots/:date', verifyToken, async (req, res) => {
  const { date } = req.params;
  
  try {
    const db = req.app.locals.db;
    
    // Define operating hours (8:00 to 16:00, hourly slots)
    const operatingHours = [
      '08:00:00', '09:00:00', '10:00:00', '11:00:00', 
      '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00'
    ];
    
    // Count tickets for each time slot
    const [ticketCounts] = await db.query(
      `SELECT queue_time, COUNT(*) as count
       FROM tickets
       WHERE queue_date = ?
       GROUP BY queue_time`,
      [date]
    );
    
    // Create a map of time slots with counts
    const slotCountMap = {};
    ticketCounts.forEach(slot => {
      slotCountMap[slot.queue_time] = slot.count;
    });
    
    // Max 10 people per time slot
    const MAX_TICKETS_PER_SLOT = 10;
    
    // Format the available slots
    const availableSlots = operatingHours.map(time => {
      const currentCount = slotCountMap[time] || 0;
      const available = currentCount < MAX_TICKETS_PER_SLOT;
      
      return {
        time,
        formattedTime: time.substring(0, 5),
        available,
        remainingSlots: MAX_TICKETS_PER_SLOT - currentCount
      };
    });
    
    res.json({
      success: true,
      date,
      availableSlots
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des créneaux disponibles'
    });
  }
});

// Update ticket status (mark as present or absent)
router.put('/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  
  if (!['present', 'absent'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Statut invalide. Les valeurs acceptées sont "present" ou "absent"'
    });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Check if ticket exists and belongs to user
    const [tickets] = await db.query(
      'SELECT * FROM tickets WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket non trouvé ou n\'appartient pas à l\'utilisateur'
      });
    }
    
    const ticket = tickets[0];
    
    // Cannot update if ticket is already completed or canceled
    if (ticket.status === 'completed' || ticket.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Ce ticket a déjà été traité et ne peut plus être modifié'
      });
    }
    
    // Update ticket status
    await db.query(
      'UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?',
      [status === 'present' ? 'active' : 'canceled', id]
    );
    
    // If ticket is marked as absent, update queue positions for tickets after this one
    if (status === 'absent') {
      const [ticketsToUpdate] = await db.query(
        `SELECT id, user_id 
         FROM tickets 
         WHERE queue_date = ? 
         AND queue_time = ? 
         AND queue_position > ? 
         AND status IN ('pending', 'active')
         ORDER BY queue_position ASC`,
        [ticket.queue_date, ticket.queue_time, ticket.queue_position]
      );
      
      // Update each ticket's position
      for (const ticketToUpdate of ticketsToUpdate) {
        await db.query(
          'UPDATE tickets SET queue_position = queue_position - 1, updated_at = NOW() WHERE id = ?',
          [ticketToUpdate.id]
        );
        
        // In a real app, you would notify these users that their position has changed
      }
    }
    
    res.json({
      success: true,
      message: status === 'present' 
        ? 'Votre présence a été confirmée' 
        : 'Votre ticket a été annulé'
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut du ticket'
    });
  }
});

module.exports = router;