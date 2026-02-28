const express = require('express');
const imagekit = require("../utils/imagekit");
const router = express.Router();

router.get('/auth', (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

module.exports = router;