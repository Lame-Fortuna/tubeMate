//----------------------------------------------Routes--------------------------------------------------------------------

const express = require('express');
//const{ exec }=require('child_process');  // 'exec' is how we execute codes in command line applications.
const { exec } = require('youtube-dl-exec');    //Node Module youtube-dl-exec

const path=require('path')

const NodeID3 = require('node-id3')

const { start } = require('repl');
const router= express.Router();

//Home
router.get('/',(req,res) =>{
    res.render("yt");
})

//Audio
router.get('/audio/',(req,res)=>{
    res.render("yt-audio", { vidId: "", title: "" });
})

//Video
router.get('/video/',(req,res)=>{
    res.render("yt-video", { vidId: "", title: "" });
})

router.get('/playlist',(req,res)=>{
    res.render("yt-playlist");
})

//Link and stuff
//Link format https://www.youtube.com/watch?v=Dy4HA3vUv2c where "Dy4HA3vUv2c" is the video ID.
//Or in format https://youtu.be/-9n_ZEqXYRE?si=LKrk9JY4vU7Leaox  where "-9n_ZEqXYRE" is the video id
//https://www.youtube.com/watch?v=CJ68kQLS250l

router.get('/audio/:vidId', async (req, res) => {
    try {
        const vidId = req.params.vidId;
        const title = await getVideoTitle(`https://www.youtube.com/watch?v=${vidId}`);
        
        if (!title) {
            throw new Error('Video title not found');
        }
        
        res.render("yt-audio", { vidId: vidId, title: title });
    } catch (error) {
        console.error('Error fetching video details:', error);
        res.status(500).send('Error fetching video details');
    }
});

router.get('/video/:vidId', async (req, res) => {
    try {
        const vidId = req.params.vidId;
        const title = await getVideoTitle(`https://www.youtube.com/watch?v=${vidId}`);
        
        res.render("yt-video", { vidId: vidId, title: title });
    } catch (error) {
        console.error('Error fetching video details:', error);
        res.status(500).send('Error fetching video details');
    }
});


router.post('/audio/convert', (req, res) => {
    const fileName = req.body.fileName;
    const link = req.body.link;
    const qual = req.body.quality;
    const id3= req.body.id3;   

    if( id3!=0 ){
        tags={
            title : req.body.title,
            artist : req.body.artist,
            album : req.body.album,
            year : req.body.year,
            cmnt : req.body.cmnt
        }
    }

    const options = {
        output: `/files/${fileName}`,
        audioQuality: qual,
        embedThumbnail: true,
        extractAudio: true,
        audioFormat: 'mp3',
    };

   exec(link, options)
        .then(output => {
            if (id3!=0){
                console.log("writing id3...")
                NodeID3.write(tags, `./files/${fileName}.mp3`)
            }
            res.download(`./files/${fileName}.mp3`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

router.post('/video/convert', (req, res) => {
    const fileName = req.body.fileName;
    const link = req.body.link;
    const qual = req.body.quality;

    const options = {
        output: `/files/${fileName}`,
        audioQuality: qual,
        embedSubs: true,
        embedChapters: true,
        formatSort: 'res,ext:mp4:m4a',
        recode: 'mp4'
    };

   exec(link, options)
        .then(output => {
            res.download(`./files/${fileName}.mp4`);
        })
        .catch(error => {
            console.error('Error:', error);
        });

/*    var cmd = ` -o %(title)s --embed-thumbnail --embed-subs --embed-chapters -S res,ext:mp4:m4a --recode mp4 ${link}`;
    var file_name = `${fileName}.mp4`;     // + format;

    const cmd2= `mv ${file_name} D:\TubeMate\files`;
    exec(cmd, (error, stdout, sterr) => {
        if (error) {
            console.error('exec error: ');
            res.status(500).send(cmd);
            return;
        }else{
            exec(cmd2, (error, stdout, sterr) => {
                if (error) {
                    console.error('exec error: ');
                    res.status(500).send(cmd2);
                    return;
                res.download(`./files/${file_name}`);
                }
            });   
        }
    });   
*/                  
});


async function getVideoTitle(videoUrl) {
    const module = await import('node-fetch');
    fetch = module.default;
    try {
        const response = await fetch(videoUrl);
        const html = await response.text();
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'Video Title Not Found';
        console.log('Video Title:', title);
        return title.slice(0,title.length-10);
    } catch (error) {
        console.error('Error fetching video title:', error.message);
        return null;
    }
}

module.exports= router;