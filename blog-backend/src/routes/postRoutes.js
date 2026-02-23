const express = require('express');
const router = express.Router();
const {createPost, getPosts, getPostById, updatePost, deletePost} = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')

// pubilc routes
router.get('/', getPosts)
router.get('/:id', getPostById)

//protected routes
router.post('/', protect, createPost)
router.put('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)


module.exports = router;