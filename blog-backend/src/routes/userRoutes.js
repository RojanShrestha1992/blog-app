const express = require('express');
const multer = require('multer');
const { getUserProfile, updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:id", getUserProfile)
router.put('/avatar', protect, upload.single('avatar'), updateAvatar)

module.exports = router;