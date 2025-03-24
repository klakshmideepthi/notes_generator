# Audio Notes Generator

A web application that converts audio recordings into organized study notes using Deepgram for audio transcription and Google's Gemini AI for note generation.

## Features

- Audio file upload (supports files up to 10MB)
- Automatic speech-to-text transcription using Deepgram
- AI-powered study notes generation using Google's Gemini AI
- Organized notes format including:
  - Main Topics
  - Key Concepts
  - Summary
  - Review Questions

## Prerequisites

Before running the application, make sure you have:
- Node.js installed (latest LTS version recommended)
- NPM (Node Package Manager)
- Deepgram API key
- Google Gemini API key

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd notes-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Important Note:** Never commit your `.env` file to version control. Add `.env` to your `.gitignore` file to prevent accidentally pushing sensitive information.

## Running the Application

The application consists of both a backend server and a frontend React application. You can run them together using:

```bash
npm run dev
```

This will start:
- Backend server on port 3001 (or your specified PORT in .env)
- Frontend development server on port 3000

Alternatively, you can run them separately:

- For backend only:
```bash
npm run server
```

- For frontend only:
```bash
npm run client
```

## Building for Production

To create a production build:

```bash
npm run build
```

## Environment Variables

The following environment variables are required in your `.env` file:

- `DEEPGRAM_API_KEY`: Your Deepgram API key for audio transcription
- `REACT_APP_GEMINI_API_KEY`: Your Google Gemini API key for AI note generation
- `PORT`: (Optional) Port number for the backend server (defaults to 3001)

To obtain the required API keys:
1. Get a Deepgram API key from [Deepgram's website](https://deepgram.com)
2. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- APIs:
  - Deepgram for audio transcription
  - Google Gemini AI for note generation
- Additional Libraries:
  - axios for HTTP requests
  - multer for file uploads
  - cors for Cross-Origin Resource Sharing

## Limitations

- Maximum audio file size: 10MB
- Supported audio formats: Common audio and video formats
- Maximum transcript length for note generation: 30,000 characters
