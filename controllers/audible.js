const { exec } = require('youtube-dl-exec');
const NodeID3 = require('node-id3');

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

const page1 = (req, res) => {
    res.render("yt-audio", { vidId: "", title: "" });
};

const page2 = async (req, res) => {
    try {
        const vidId = req.params.vidId;
        const title = await getVideoTitle(`https://www.youtube.com/watch?v=${vidId}`);

        if (!title) {
            throw new Error('Video title not found');
        }

        res.render("yt-audio", { vidId, title });
    } catch (error) {
        console.error('Error fetching video details:', error);
        res.status(500).send('Error fetching video details');
    }
};

const convertAudio = (req, res) => {
    const fileName = req.body.fileName;
    const link = req.body.link;
    const qual = req.body.quality;
    const id3 = req.body.id3;

    let tags = {};
    if (id3 !== 0) {
        tags = {
            title: req.body.title,
            artist: req.body.artist,
            album: req.body.album,
            year: req.body.year,
            comment: req.body.comment
        };
    }

    const options = {
        output: `files/${fileName}.mp3`,
        audioQuality: qual,
        embedThumbnail: true,
        extractAudio: true,
        audioFormat: 'mp3',
    };

    exec(link, options)
        .then(() => {
            if (id3 !== 0) {
                console.log("Writing ID3 tags...");
                NodeID3.write(tags, `files/${fileName}.mp3`);
            }
            res.download(`files/${fileName}.mp3`);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Error converting audio');
        });
};

module.exports = {
    page1,
    page2,
    convertAudio
};
