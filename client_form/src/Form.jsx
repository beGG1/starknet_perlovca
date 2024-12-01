import React from 'react';
import TextInput from './TextInput';

const Form = ({ text, setText, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <button type="submit" disabled={!text.trim()}>Submit</button>
  </form>
);

export default Form;