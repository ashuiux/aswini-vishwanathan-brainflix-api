const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 8080; 

app.use(cors());
app.use(bodyParser.json());

app.use('/images', express.static('public'));

const videoDataPath = './data/videos.json';

function loadVideos() {
    return JSON.parse(fs.readFileSync(videoDataPath, 'utf-8'));
}

function saveVideos(videos) {
    fs.writeFileSync(videoDataPath, JSON.stringify(videos, null, 2));
}


app.get('/videos', (req, res) => {
    const videos = loadVideos();
    res.json(videos);
});

app.get('/videos/:id', (req, res) => {
    const videos = loadVideos();
    const video = videos.find(v => v.id === req.params.id);
    if (video) {
        res.json(video);
    } else {
        res.status(404).json({ message: 'Video not found' });
    }
});

app.post('/videos', (req, res) => {
    const videos = loadVideos();
    const newVideo = {
        id: String(Date.now()), 
        title: req.body.title,
        description: req.body.description,
        image: '/images/default-thumbnail.jpg', 
        channel: 'Placeholder Channel',
        views: '0',
        likes: '0',
        duration: '3:00',
        timestamp: Date.now(),
        comments: [],
    };

    videos.push(newVideo);
    saveVideos(videos);
    res.status(201).json(newVideo);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
