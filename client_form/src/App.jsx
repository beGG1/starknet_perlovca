import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Form';
import MessageList from './MessageList';
import handleSubmit from './handleSubmit';
import TextInput from './TextInput';

function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);
  }, []);

  const handleFormSubmit = (e) => handleSubmit(e, text, setMessages, messages);

  return (
    <div className="app-container">
      <h2>Welcome to Perlovca!</h2>
      <TextInput value={text} onChange={setText} />
      <Form
        text={text}
        setText={setText}
        handleSubmit={handleFormSubmit}
      />
      <MessageList messages={messages} />
    </div>
  );
}

export default App;