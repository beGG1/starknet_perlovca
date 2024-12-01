import React from 'react';

const Form = ({ text, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <button type="submit" disabled={!text.trim()}>Submit</button>
  </form>
);

export default Form;