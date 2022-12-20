import Link from 'next/link';
import { useState } from 'react';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { firestoreClient } from '../firebase/firebaseClient';
import { collections } from '../firebase/collections';
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { validateInputs } from '../lib/validateInputs';

export interface Inputs {
  title: string;
  description: string;
}

export default function CreatePage() {
  const [inputs, setInputs] = useState<Inputs>({
    title: '',
    description: ''
  });

  const collectionRef = collection(firestoreClient, collections.decks);
  const newDeckId = doc(collectionRef).id;
  const documentRef = doc(collectionRef, newDeckId);

  const { mutate, isLoading, isSuccess } =
    useFirestoreDocumentMutation(documentRef);

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInputs<Inputs>(inputs)) {
      mutate(
        {
          id: newDeckId,
          title: inputs.title.trim(),
          description: inputs.description.trim(),
          createdAt: serverTimestamp()
        },
        {
          onSuccess() {
            setInputs({ title: '', description: '' });
          }
        }
      );
    }
  };

  return (
    <div>
      <h1>Create Deck</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">
          <input
            type="text"
            id="title"
            name="title"
            value={inputs.title}
            required
            placeholder="Title"
            onChange={handleOnChange}
          />
        </label>
        <br />
        <label htmlFor="description">
          <input
            type="text"
            id="description"
            name="description"
            required
            value={inputs.description}
            placeholder="Description"
            onChange={handleOnChange}
          />
        </label>
        <br />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit">Create Deck</button>
        )}
        {!isLoading && isSuccess && <p>Success</p>}
      </form>
      <Link href={`/`}>Back</Link>
    </div>
  );
}
