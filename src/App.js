import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [studyNotes, setStudyNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingNotes, setProcessingNotes] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select an audio file under 10MB');
      setFile(null);
    }
  };

  const generateStudyNotes = async (text) => {
    try {
      setProcessingNotes(true);
      setError('');

      // Send request to backend for processing
      const response = await axios.post('http://localhost:3001/api/generate-notes', { text });
      
      if (!response.data.notes) {
        throw new Error('No notes were generated');
      }

      setStudyNotes(response.data.notes);
    } catch (error) {
      console.error('Error generating notes:', error);
      setError(error.response?.data?.details || 'Unable to generate study notes. Please try again.');
    } finally {
      setProcessingNotes(false);
    }
  };

  const handleTranscribe = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setTranscript('');
    setStudyNotes('');

    try {
      // Create form data
      const formData = new FormData();
      formData.append('audio', file);

      // Send to backend for transcription
      const transcriptionResponse = await axios.post('http://localhost:3001/api/transcribe', formData);
      const transcriptText = transcriptionResponse.data.transcript;
      setTranscript(transcriptText);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to transcribe the audio file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Audio Notes Generator</h1>
      </header>
      
      <main className="App-main">
        <form onSubmit={handleTranscribe} className="upload-form">
          <div className="file-input-container">
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <button type="submit" disabled={!file || loading}>
              {loading ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>

        {transcript && (
          <section className="results-section">
            <h2>Transcript</h2>
            <div className="transcript-container">
              <p>{transcript}</p>
              {!studyNotes && !processingNotes && (
                <button 
                  onClick={() => generateStudyNotes(transcript)}
                  className="generate-notes-btn"
                >
                  Generate Study Notes
                </button>
              )}
            </div>
          </section>
        )}

        {processingNotes && (
          <section className="results-section">
            <h2>Generating Study Notes...</h2>
            <div className="loading-spinner"></div>
          </section>
        )}

        {studyNotes && (
          <section className="results-section">
            <h2>Study Notes</h2>
            <div className="notes-container">
              <pre>{studyNotes}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
