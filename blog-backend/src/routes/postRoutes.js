const express = require('express');
const router = express.Router();
const {createPost, getPosts, getPostById, updatePost, deletePost} = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage})

// pubilc routes
router.get('/', getPosts)
router.get('/:id', getPostById)

//protected routes
router.post('/', protect, upload.single('media'), createPost)
router.put('/:id', protect, updatePost)
router.delete('/:id', protect, deletePost)


module.exports = router;