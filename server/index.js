import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

import connectDB from './mongodb/connect.js';
import Post from './mongodb/models/post.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- POLLINATIONS AI (Free & Fast Image Gen) ---
async function generateImage(prompt) {
  const randomSeed = Math.floor(Math.random() * 100000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${randomSeed}&nologo=true`;

  console.log("🎨 Fetching from Pollinations:", imageUrl);

  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

app.get('/', (req, res) => res.send('ImaginAI Server is Active!'));

// --- 1. GET ALL POSTS (Community Gallery) ---
app.get('/api/v1/post', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

// --- 2. SHARE POST (Save to MongoDB) ---
app.post('/api/v1/post', async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    
    // Saving to MongoDB
    // Note: Since we are not using Cloudinary, we save the Base64 string directly.
    // This works fine for a portfolio project.
    const newPost = await Post.create({
      name,
      prompt,
      photo,
    });

    console.log("✅ Post Shared to Community!");
    res.status(200).json({ success: true, data: newPost });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

// --- 3. GENERATE IMAGE ROUTE ---
app.post('/api/v1/dalle', async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiImage = await generateImage(prompt);
    console.log("✅ Image Generated!");
    res.status(200).json({ photo: aiImage });
  } catch (error) {
    console.error("❌ Generation Error:", error.message);
    res.status(500).send("Something went wrong");
  }
});

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB(process.env.MONGODB_URL);
    console.log("✅ MongoDB Connected");
    
    app.listen(8080, () => console.log('🚀 Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();