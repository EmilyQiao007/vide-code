import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Setup Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


// Page Routes
app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/hub', (req, res) => {
  res.render('dashboard');
});

app.get('/app/todo', (req, res) => {
  res.render('apps/todo');
});

app.get('/app/links', (req, res) => {
  res.render('apps/links');
});

// API Routes
app.post('/api/summarize', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const textContent = $('body').text().replace(/\s\s+/g, ' ').trim();
        const maxLength = 10000; // Character limit
        const truncatedContent = textContent.substring(0, maxLength);

        const prompt = `Based on the following content, provide a concise summary (1-2 sentences) and up to 5 relevant tags. Format the output as a JSON object with "summary" and "tags" keys. Content: "${truncatedContent}"`;
        
        const result = await model.generateContent(prompt);
        const aiResponse = await result.response;
        const jsonText = aiResponse.text().replace(/```json/g, '').replace(/```/g, '');
        
        res.json(JSON.parse(jsonText));

    } catch (error) {
        console.error('Error summarizing URL:', error);
        res.status(500).json({ error: 'Failed to summarize URL' });
    }
});

app.post('/api/suggest-tasks', async (req, res) => {
    const { context } = req.body;
    
    try {
        const prompt = `Based on this context: "${context || 'a productive day'}", suggest 5 actionable todo items. Format the output as a JSON object with a "tasks" key which is an array of strings.`;
        
        const result = await model.generateContent(prompt);
        const aiResponse = await result.response;
        const jsonText = aiResponse.text().replace(/```json/g, '').replace(/```/g, '');

        res.json(JSON.parse(jsonText));
    } catch (error) {
        console.error('Error suggesting tasks:', error);
        res.status(500).json({ error: 'Failed to suggest tasks' });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyDNvcN_L4ZEk6ugFSQninwfcaVSLzzg5t8') {
    console.warn('WARNING: GEMINI_API_KEY is not set. Please add it to your .env file.');
  }
});