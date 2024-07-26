const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audible');

router.get('/audio/', audioController.renderAudioPage);
router.get('/audio/:vidId', audioController.renderAudioPageWithVidId);
router.post('/audio/convert', audioController.convertAudio);

module.exports = router;

