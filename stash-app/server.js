const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- CONFIGURATION ---
// TODO: Replace with your service account key file
const serviceAccount = require('./serviceAccountKey.json');
// TODO: Replace with your Gemini API Key
const GEMINI_API_KEY = 'AIzaSyDNvcN_L4ZEk6ugFSQninwfcaVSLzzg5t8';

// --- INITIALIZATION ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview"});

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// --- ROUTES ---
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


// --- FIRESTORE LISTENER ---
function setupFirestoreListener() {
    db.collection('links').where('status', '==', 'pending')
      .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                  const linkId = change.doc.id;
                  const linkData = change.doc.data();
                  console.log(`New pending link detected: ${linkData.url}`);
                  processLink(linkId, linkData.url);
              }
          });
      }, err => {
          console.log(`Encountered error: ${err}`);
      });
}

async function processLink(linkId, url) {
    try {
        // 1. Fetch and Scrape URL
        console.log(`Fetching content from: ${url}`);
        const response = await axios.get(url, { timeout: 10000 });
        const $ = cheerio.load(response.data);
        const textContent = $('body').text().replace(/\s\s+/g, ' ').trim();
        console.log('Content scraped successfully.');

        if (!textContent) {
            throw new Error('Could not extract text content from URL.');
        }

        // 2. Call Gemini API
        console.log('Sending content to Gemini API...');
        const prompt = `Summarize this article in 3 sentences and provide 3 relevant tags (as a comma-separated string). Article text: "${textContent.substring(0, 15000)}"`;
        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const geminiText = geminiResponse.text();
        
        // Basic parsing of Gemini response
        const [summary, tagsString] = geminiText.split('Tags:');
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
        console.log('Received summary and tags from Gemini.');

        // 3. Update Firestore
        console.log(`Updating Firestore for linkId: ${linkId}`);
        await db.collection('links').doc(linkId).update({
            summary: summary.replace('Summary:', '').trim(),
            tags: tags,
            status: 'processed',
            processedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Firestore updated successfully.');

    } catch (error) {
        console.error(`Error processing link ${url} (ID: ${linkId}):`, error.message);
        await db.collection('links').doc(linkId).update({
            status: 'failed',
            error: error.message
        });
    }
}


// --- SERVER START ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    setupFirestoreListener();
    console.log('Firestore listener started. Awaiting new links...');
});
