import Link from 'next/link';
import { useState, ChangeEvent } from 'react';
import { GetServerSidePropsContext } from 'next';
import { db } from '../../firebase/admin';
import { collections } from '../../firebase/collections';
import { Deck, deckSchema } from '../../schema/deck';
import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { useFirestoreDocumentMutation } from '@react-query-firebase/firestore';
import { validateInputs } from '../../lib/validateInputs';
import type { Inputs } from '../create';

interface Props {
  deck: Deck;
}

export default function EditPage({ deck }: Props) {
  const deckRef = doc(collection(firestore, collections.decks), deck.id);
  const [edited, setEdited] = useState(false);
  const [inputs, setInputs] = useState<Inputs>({
    title: deck.title,
    description: deck.description
  });

  const { mutate, isLoading, isSuccess } = useFirestoreDocumentMutation(
    deckRef,
    { merge: true }
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: e.currentTarget.value
    });
    setEdited(true);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInputs<Inputs>(inputs)) {
      mutate(
        {
          title: inputs.title.trim(),
          description: inputs.description.trim()
        },
        {
          onSuccess() {
            setEdited(false);
          }
        }
      );
    }
  };

  return (
    <div>
      <h1>Edit Deck</h1>
      <p>{deck.id}</p>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="title">
          <input name="title" value={inputs.title} onChange={handleOnChange} />
        </label>
        <br />
        <label htmlFor="description">
          <input
            name="description"
            value={inputs.description}
            onChange={handleOnChange}
          />
        </label>
        <br />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit" disabled={!edited}>
            Save Changes
          </button>
        )}
      </form>
      {isSuccess && <p>Successfully saved.</p>}
      <Link href="/">Back</Link>
    </div>
  );
}
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (!id) {
    return {
      notFound: true
    };
  }

  const document = await db.collection(collections.decks).doc(id).get();

  const parsed = deckSchema.parse(document.data());

  const deck = {
    ...parsed,
    createdAt: parsed.createdAt.toDate().toISOString()
  };
  return {
    props: { deck }
  };
}
