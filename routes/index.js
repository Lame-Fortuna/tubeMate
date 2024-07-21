const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.render("yt");
});


//Work in Progress
router.get('/playlist', (req, res) => {
    res.render("yt-playlist");
});

module.exports = router;
