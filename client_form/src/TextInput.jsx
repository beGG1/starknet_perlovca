import React from 'react';
import './App.css';

const TextInput = ({ value, onChange }) => (
    <label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Place your text for validation"
      />
    </label>
);

export default TextInput;