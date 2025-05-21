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

// Get all user requests
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;
  
  try {
    const db = req.app.locals.db;
    
    // Prepare the query
    let query = `
      SELECT sr.*, s.name as service_name, s.icon
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      WHERE sr.user_id = ?
    `;
    
    const queryParams = [userId];
    
    // Add status filter if provided
    if (status && ['pending', 'in_progress', 'completed', 'rejected'].includes(status)) {
      query += ' AND sr.status = ?';
      queryParams.push(status);
    }
    
    // Add order by
    query += ' ORDER BY sr.created_at DESC';
    
    // Execute query
    const [requests] = await db.query(query, queryParams);
    
    // Format dates
    const formattedRequests = requests.map(request => ({
      ...request,
      formattedCreatedAt: new Date(request.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      formattedUpdatedAt: request.updated_at ? new Date(request.updated_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : null
    }));
    
    res.json({
      success: true,
      requests: formattedRequests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des demandes'
    });
  }
});

// Get request details
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const db = req.app.locals.db;
    
    // Get request details
    const [requests] = await db.query(
      `SELECT sr.*, s.name as service_name, s.description as service_description, s.icon
       FROM service_requests sr
       JOIN services s ON sr.service_id = s.id
       WHERE sr.id = ? AND sr.user_id = ?`,
      [id, userId]
    );
    
    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée ou n\'appartient pas à l\'utilisateur'
      });
    }
    
    // Get request updates/history
    const [updates] = await db.query(
      `SELECT * FROM request_updates 
       WHERE request_id = ? 
       ORDER BY created_at ASC`,
      [id]
    );
    
    // Format request
    const request = requests[0];
    const formattedRequest = {
      ...request,
      formattedCreatedAt: new Date(request.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      formattedUpdatedAt: request.updated_at ? new Date(request.updated_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : null,
      updates: updates.map(update => ({
        ...update,
        formattedCreatedAt: new Date(update.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }))
    };
    
    res.json({
      success: true,
      request: formattedRequest
    });
  } catch (error) {
    console.error('Get request details error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails de la demande'
    });
  }
});

// Cancel a request
router.put('/:id/cancel', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { reason } = req.body;
  
  try {
    const db = req.app.locals.db;
    
    // Check if request exists and belongs to user
    const [requests] = await db.query(
      'SELECT * FROM service_requests WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée ou n\'appartient pas à l\'utilisateur'
      });
    }
    
    const request = requests[0];
    
    // Cannot cancel if request is already completed or rejected
    if (request.status === 'completed' || request.status === 'rejected' || request.status === 'canceled') {
      return res.status(400).json({
        success: false,
        message: 'Cette demande ne peut pas être annulée car elle est déjà ' + 
                (request.status === 'completed' ? 'terminée' : 
                 request.status === 'rejected' ? 'rejetée' : 'annulée')
      });
    }
    
    // Update request status
    await db.query(
      'UPDATE service_requests SET status = "canceled", updated_at = NOW() WHERE id = ?',
      [id]
    );
    
    // Add update record
    await db.query(
      `INSERT INTO request_updates 
       (request_id, status, notes, created_by, created_at) 
       VALUES (?, "canceled", ?, "user", NOW())`,
      [id, reason || 'Annulé par l\'utilisateur']
    );
    
    res.json({
      success: true,
      message: 'Demande annulée avec succès'
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la demande'
    });
  }
});

module.exports = router;