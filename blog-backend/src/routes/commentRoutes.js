const express = require('express');
const router = express.Router();
const {
    createComment,
    getCommentsByPostId
} = require('../controllers/commentController')
const {protect} = require('../middleware/authMiddleware')

router.post('/', protect, createComment)
router.get('/:postId', getCommentsByPostId)

module.exports = router;