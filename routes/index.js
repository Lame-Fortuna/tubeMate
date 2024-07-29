const express = require('express');
const fs = require('fs')
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    const remove = () => {
        fs.rm('files', { recursive: true }, (error) => {
            if (error) {
                console.log('Error deleting contents of files because: ', error);
            } else {
                console.log('Cleared the contents of files');
            }
        });
    };
    
    remove();

    res.render("yt");
});


//Work in Progress
router.get('/playlist', (req, res) => {
    res.render("yt-playlist");
});

module.exports = router;
