import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (e.g., index.html) from public folder
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-blog', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that writes high-quality blog posts.',
        },
        {
          role: 'user',
          content: `Write a detailed and engaging blog post on the topic: "${topic}"`,
        },
      ],
      temperature: 0.7,
    });

    const blog = chatCompletion.choices[0]?.message?.content;
    res.json({ blog });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to generate blog content' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
