import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const videoDataPath = './data/videos.json';

function loadVideos(callback) {
  fs.readFile(videoDataPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading video data:', err);
      return callback(err, null);
    }
    try {
      const jsonData = JSON.parse(data);
      callback(null, jsonData);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      callback(error, null);
    }
  });
}

function saveVideos(videos, callback) {
  fs.writeFile(videoDataPath, JSON.stringify(videos, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Error writing video data:', err);
      return callback(err);
    }
    callback(null);
  });
}

router.get('/', (req, res) => {
  loadVideos((err, videos) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading video data' });
    }
    const minimalData = videos.map(video => ({
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image
    }));
    res.json(minimalData);
  });
});

router.get('/:id', (req, res) => {
  loadVideos((err, videos) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading video data' });
    }
    const video = videos.find(v => v.id === req.params.id);
    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  });
});

router.post('/', (req, res) => {
  loadVideos((err, videos) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading video data' });
    }

    const { title, channel, description } = req.body;
    if (!title || !channel || !description) {
      return res.status(400).json({ error: 'Title, channel, and description are required' });
    }

    const newVideo = {
      id: uuidv4(),
      title,
      channel,
      image: 'http://localhost:8080/images/default-thumbnail.jpg',
      description,
      views: '739,945',
      likes: '839,945',
      duration: ':00',
      video: 'http://localhost:8080/stream',
      timestamp: Date.now(),
      comments: []
    };

    videos.push(newVideo);

    saveVideos(videos, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving video data' });
      }
      res.status(201).json(newVideo);
    });
  });
});

export default router;
