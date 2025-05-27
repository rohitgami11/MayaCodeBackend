const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Post routes
router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Comment routes
router.post('/:id/comments', postController.addComment);

// Like route
router.post('/:id/like', postController.likePost);

// User posts route
router.get('/user/:userId', postController.getUserPosts);

module.exports = router; 