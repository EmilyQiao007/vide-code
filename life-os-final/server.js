import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
app.post('/api/ai/summarize', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const textContent = $('body').text();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        const prompt = `Summarize the following text and provide up to 5 relevant tags (as a comma-separated string): "${textContent.substring(0, 2000)}"`;

        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const text = geminiResponse.text();

        const [summary, tags] = text.split('Tags:');


        res.send({ summary: summary.trim(), tags: tags ? tags.trim() : '' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to summarize URL' });
    }
});

app.post('/api/ai/suggest', async (req, res) => {
    const { context } = req.body;

    if (!context) {
        return res.status(400).send({ error: 'Context is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});
        const prompt = `Based on the following context: "${context}", suggest 5 actionable todo items. Return them as a comma-separated list.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const suggestions = text.split(',').map(s => s.trim());

        res.send({ suggestions });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to get suggestions' });
    }
});

app.get('/api/ai/models', async (req, res) => {
    try {
        const { models } = await genAI.listModels();
        const modelNames = models.map(model => model.name);
        res.send({ models: modelNames });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to list models' });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
