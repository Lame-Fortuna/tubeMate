const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audible');

router.get('/audio/', audioController.page1);
router.get('/audio/:vidId', audioController.page2);
router.post('/audio/convert', audioController.convertAudio);

module.exports = router;

