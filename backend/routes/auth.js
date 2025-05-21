const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sonabel-secret-key';

// Register a new user
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  
  try {
    const db = req.app.locals.db;
    
    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR phone = ?',
      [email, phone]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur existe déjà avec cet email ou ce numéro de téléphone'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())',
      [fullName, email, phone, hashedPassword]
    );
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const db = req.app.locals.db;
    
    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    const user = users[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, token non fourni'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = req.app.locals.db;
    
    // Get user data
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, created_at, last_login FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, token non fourni'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = req.app.locals.db;
    
    const { fullName, phone } = req.body;
    
    // Update user data
    await db.query(
      'UPDATE users SET full_name = ?, phone = ?, updated_at = NOW() WHERE id = ?',
      [fullName, phone, decoded.id]
    );
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, token non fourni'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = req.app.locals.db;
    
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    const user = users[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await db.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, decoded.id]
    );
    
    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Password change error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe'
    });
  }
});

module.exports = router;