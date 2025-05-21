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

// Get all services
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Get all active services
    const [services] = await db.query(
      'SELECT * FROM services WHERE active = 1 ORDER BY display_order ASC'
    );
    
    res.json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services'
    });
  }
});

// Get service details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const db = req.app.locals.db;
    
    // Get service details
    const [services] = await db.query(
      'SELECT * FROM services WHERE id = ? AND active = 1',
      [id]
    );
    
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Get service requirements
    const [requirements] = await db.query(
      'SELECT * FROM service_requirements WHERE service_id = ? ORDER BY display_order ASC',
      [id]
    );
    
    res.json({
      success: true,
      service: {
        ...services[0],
        requirements
      }
    });
  } catch (error) {
    console.error('Get service details error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du service'
    });
  }
});

// Get service categories
router.get('/categories/all', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Get all service categories
    const [categories] = await db.query(
      'SELECT * FROM service_categories WHERE active = 1 ORDER BY display_order ASC'
    );
    
    // Get services for each category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      const [services] = await db.query(
        'SELECT * FROM services WHERE category_id = ? AND active = 1 ORDER BY display_order ASC',
        [category.id]
      );
      
      category.services = services;
    }
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories de services'
    });
  }
});

// Create a service request
router.post('/request', verifyToken, async (req, res) => {
  const { serviceId, details, address, preferredDate } = req.body;
  const userId = req.user.id;
  
  if (!serviceId || !details || !address) {
    return res.status(400).json({
      success: false,
      message: 'Informations manquantes. Les champs serviceId, details, et address sont requis.'
    });
  }
  
  try {
    const db = req.app.locals.db;
    
    // Check if service exists
    const [services] = await db.query(
      'SELECT * FROM services WHERE id = ? AND active = 1',
      [serviceId]
    );
    
    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Create service request
    const [result] = await db.query(
      `INSERT INTO service_requests 
       (user_id, service_id, details, address, preferred_date, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId, serviceId, details, address, preferredDate || null]
    );
    
    // Generate reference number
    const reference = `REF-${(100000 + result.insertId).toString()}`;
    
    // Update reference
    await db.query(
      'UPDATE service_requests SET reference = ? WHERE id = ?',
      [reference, result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Demande de service créée avec succès',
      request: {
        id: result.insertId,
        reference,
        status: 'pending',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Service request creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la demande de service'
    });
  }
});

module.exports = router;