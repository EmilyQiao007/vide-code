require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Initialize the Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' });

// In-memory data store
let items = [];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Helper function for AI task breakdown ---
async function breakdownTaskWithGemini(task) {
    if (!task) {
        return [];
    }
    try {
        const prompt = `Break down the task "${task}" into a checklist of 3-5 subtasks. Return the result as a JSON array of strings. For example, for the task 'Make Lasagna', return ["Buy Pasta", "Buy Sauce", "Buy Cheese"].`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        // Clean the response to extract only the JSON array part
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return [];
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return []; // Return empty array on error
    }
}


// --- Routes ---
app.get('/items', (req, res) => {
    res.json(items);
});

app.post('/api/breakdown', async (req, res) => {
    const { task } = req.body;
    const subTasks = await breakdownTaskWithGemini(task);
    res.json(subTasks);
});

app.post('/add-item', async (req, res) => {
    const { item } = req.body;
    if (item) {
        const subTasks = await breakdownTaskWithGemini(item);
        const newItem = { task: item, subTasks };
        items.push(newItem);
        res.status(201).json({ message: 'Item added successfully' });
    } else {
        res.status(400).json({ message: 'Item cannot be empty' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
