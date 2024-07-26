const express = require('express');
const router = express.Router();
const videoController = require('../controllers/visible');

router.get('/video/', videoController.renderVideoPage);
router.get('/video/:vidId', videoController.renderVideoPageWithVidId);
router.post('/video/convert', videoController.convertVideo);

module.exports = router;