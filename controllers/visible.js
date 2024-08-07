const { exec } = require('youtube-dl-exec');

const getVideoTitle = async (videoUrl) => {
    const youtubedl = require('youtube-dl-exec')
    try {
        const info = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
        });
        return info.title;
    } catch (error) {
        console.error('Error fetching YouTube title:', error);
        return null;
    }
}

const Vpage1 = (req, res) => {
    res.render("yt-video", { vidId: "", title: "" });
};

const VPage2 = async (req, res) => {
    try {
        const vidId = req.params.vidId;
        let title = await getVideoTitle(`https://www.youtube.com/watch?v=${vidId}`);

        if (!title) {
            console.error('Video title not found');
            title= '';
        }
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
    Vpage1,
    VPage2,
    convertVideo
};
