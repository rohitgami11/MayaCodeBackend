const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add logging middleware
router.use((req, res, next) => {
  console.log('🔍 Incoming request:', {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Create new user profile
router.post('/phone/:phone', userController.createUserProfile);

// Profile routes
router.get('/phone/:phone', userController.getUserProfile);
router.put('/phone/:phone', userController.updateUserProfile);
router.delete('/phone/:phone', userController.deleteUserProfile);

// Stats routes
router.put('/phone/:phone/stats', userController.updateUserStats);

// Post management routes
router.post('/phone/:phone/posts', userController.addCreatedPost);

// Preferences routes
router.put('/phone/:phone/preferences', userController.updatePreferences);
router.get('/phone/:phone/preferences', userController.getPreferences);

// Get all users
router.get('/', userController.getAllUsers);

module.exports = router; 