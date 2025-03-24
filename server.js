const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Deepgram } = require('@deepgram/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Verify API keys are present
if (!process.env.DEEPGRAM_API_KEY) {
  console.error('ERROR: Deepgram API key is not set in .env file');
  process.exit(1);
}

if (!process.env.REACT_APP_GEMINI_API_KEY) {
  console.error('ERROR: Gemini API key is not set in .env file');
  process.exit(1);
}

// Initialize APIs
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// File upload and transcription endpoint
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('Received file:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Get the audio buffer
    const audioBuffer = req.file.buffer;
    
    console.log('Sending request to Deepgram...');
    
    // Transcribe the audio
    const response = await deepgram.transcription.preRecorded(
      { buffer: audioBuffer, mimetype: req.file.mimetype },
      { 
        smart_format: true, 
        punctuate: true,
        model: 'general',
        language: 'en-US',
        utterances: true,
        diarize: true,
        numerals: true
      }
    );

    if (!response?.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
      throw new Error('Invalid response format from Deepgram');
    }

    const transcript = response.results.channels[0].alternatives[0].transcript;
    console.log('Transcription successful');
    res.json({ transcript });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Failed to process audio file',
      details: error.message 
    });
  }
});

// Generate study notes endpoint
app.post('/api/generate-notes', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Generating study notes...');

    // Create a new model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the text (limit length if needed)
    const maxLength = 30000;
    const textToProcess = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    // Generate the study notes
    const prompt = `Create organized study notes from this transcript. Format your response as follows:

Main Topics:
[List the key topics covered, using bullet points]

Key Concepts:
[Define and explain important terms and ideas]

Summary:
[Provide a concise overview of the main points]

Review Questions:
[Create 3-4 questions to test understanding]

Use the following transcript as input:
"${textToProcess}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedNotes = response.text();

    if (!generatedNotes) {
      throw new Error('No content was generated');
    }

    console.log('Study notes generated successfully');
    res.json({ notes: generatedNotes });
  } catch (error) {
    console.error('Error generating study notes:', error);
    res.status(500).json({ 
      error: 'Failed to generate study notes',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Deepgram API key length: ${process.env.DEEPGRAM_API_KEY?.length}`);
  console.log(`Gemini API key length: ${process.env.REACT_APP_GEMINI_API_KEY?.length}`);
}); 