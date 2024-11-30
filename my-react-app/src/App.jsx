import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div>
      <h1>Proof Generation</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Generate Proof</button>
      </form>
      {result && (
        <div id="result">
          <p>Message: {message}</p>
          <p>Secret: {result.secret}</p>
          <p>Hash: {result.hash}</p>
        </div>
      )}
    </div>
  );
}

export default App;