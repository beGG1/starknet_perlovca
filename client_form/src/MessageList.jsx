import React from 'react';

const MessageList = ({ messages }) => (
  <div>
    <h2>Messages</h2>
    <ul>
      {messages.map((message, index) => (
        <li key={index}>
          <p>Message: {message.message}</p>
          <p>Response: {message.result === '0x1' ? '✔️' : '❌'}</p>
          <p>Time: {message.time}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default MessageList;