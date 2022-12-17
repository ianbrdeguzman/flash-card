import React, { useState } from 'react';
import Link from 'next/link';

interface Inputs {
  title: string;
  description: string;
}

export default function CreatePage() {
  const [inputs, setInputs] = useState<Inputs>({
    title: '',
    description: ''
  });

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(inputs, null, 2));
  };
  return (
    <div>
      <h1>Create Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          <input
            type="text"
            name="title"
            value={inputs.title}
            required
            placeholder="Deck Title"
            onChange={handleOnChange}
          />
        </label>
        <br />
        <label htmlFor="description">
          <input
            type="text"
            name="description"
            required
            value={inputs.description}
            placeholder="Deck Description"
            onChange={handleOnChange}
          />
        </label>
        <br />
        <button type="submit">Create Deck</button>
      </form>
    </div>
  );
}
