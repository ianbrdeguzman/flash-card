import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { collections } from '../firebase/collections';

interface Inputs {
  title: string;
  description: string;
}

export default function CreatePage() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDeckId = doc(collection(db, collections.decks)).id;

    await setDoc(doc(db, collections.decks, newDeckId), {
      id: newDeckId,
      title: inputs.title,
      description: inputs.description,
      createdAt: serverTimestamp()
    });

    router.push('/');
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
