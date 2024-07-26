const { exec } = require('youtube-dl-exec');

const getVideoTitle = async (videoUrl) => {
    const youtubedl = require('youtube-dl-exec')
    try {
        const info = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            // You can add more options here if needed
        });
        return info.title;
    } catch (error) {
        console.error('Error fetching YouTube title:', error);
        return null;
    }
}

const renderVideoPage = (req, res) => {
    res.render("yt-video", { vidId: "", title: "" });
};

const renderVideoPageWithVidId = async (req, res) => {
    try {
        const vidId = req.params.vidId;
        const title = await getVideoTitle(`https://www.youtube.com/watch?v=${vidId}`);
        res.render("yt-video", { vidId, title });
    } catch (error) {
        console.error('Error fetching video details:', error);
        res.status(500).send('Error fetching video details');
    }
};

const convertVideo = (req, res) => {
    const fileName = req.body.fileName;
    const link = req.body.link;
    const qual = req.body.quality;

    const options = {
        output: `files/${fileName}.mp4`,
        audioQuality: qual,
        embedSubs: true,
        embedChapters: true,
        formatSort: 'res,ext:mp4:m4a',
        recode: 'mp4'
    };

    exec(link, options)
        .then(() => {
            res.download(`files/${fileName}.mp4`);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Error converting video');
        });
};

module.exports = {
    renderVideoPage,
    renderVideoPageWithVidId,
    convertVideo
};
