import express from 'express';
import cors from 'cors';
import videoRouter from './routes/video.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/images', express.static('public/images')); 
app.use('/videos', videoRouter); 

app.get('/', (req, res) => {
  res.send('Welcome to the Video API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
