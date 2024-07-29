const express = require('express');
const router = express.Router();
const videoController = require('../controllers/visible');

router.get('/video/', videoController.Vpage1);
router.get('/video/:vidId', videoController.VPage2);
router.post('/video/convert', videoController.convertVideo);

module.exports = router;