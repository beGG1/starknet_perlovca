import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmittedMessage(message);
    const response = await fetch('http://127.0.0.1:8000/data/proofgeneration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const result = await response.json();
    setResult(result);
  };

  return (
    <div className="app-container">
      <h1>Proof Generation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
        />
        <button type="submit" disabled={!message.trim()}>Generate Proof</button>
      </form>
      {result && (
        <div id="result" className="result-message">
          <p>Message: was sent for proof!</p>
        </div>
      )}
    </div>
  );
}

export default App;