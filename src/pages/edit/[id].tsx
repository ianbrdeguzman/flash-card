import Link from 'next/link';
import { useState, ChangeEvent } from 'react';
import { GetServerSidePropsContext } from 'next';
import { firestoreAdmin } from '../../firebase/firebaseAdmin';
import { collections } from '../../firebase/collections';
import { Deck, deckSchema } from '../../schema/deck';
import { collection, doc } from 'firebase/firestore';
import { firestoreClient } from '../../firebase/firebaseClient';
import {
  useFirestoreDocumentDeletion,
  useFirestoreDocumentMutation
} from '@react-query-firebase/firestore';
import { validateInputs } from '../../lib/validateInputs';
import type { Inputs } from '../create';
import { useRouter } from 'next/router';

interface Props {
  deck: Deck;
}

export default function EditPage({ deck }: Props) {
  const { push } = useRouter();
  const deckRef = doc(collection(firestoreClient, collections.decks), deck.id);
  const [edited, setEdited] = useState(false);
  const [inputs, setInputs] = useState<Inputs>({
    title: deck.title,
    description: deck.description
  });

  const { mutate, isLoading, isSuccess } = useFirestoreDocumentMutation(
    deckRef,
    { merge: true }
  );

  const { mutate: deleteDeck, isSuccess: isDeleteSuccess } =
    useFirestoreDocumentDeletion(deckRef, {
      onSettled() {
        setTimeout(() => {
          push('/');
        }, 1000);
      }
    });

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
          <input
            id="title"
            name="title"
            value={inputs.title}
            onChange={handleOnChange}
          />
        </label>
        <br />
        <label htmlFor="description">
          <input
            id="description"
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
      <button onClick={() => deleteDeck()} type="button">
        Delete Deck
      </button>
      <br />
      {isSuccess && <p>Successfully saved.</p>}
      {isDeleteSuccess && <p>Successfully deleted.</p>}
      <Link href="/">Back</Link>
    </div>
  );
}
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const deckId = context.params?.id;
  const deckRef = firestoreAdmin
    .collection(collections.decks)
    .doc(deckId ?? '');

  if (!deckId || !deckRef) {
    return {
      notFound: true
    };
  }

  const deckDocument = await deckRef.get();

  const parsedDeck = deckSchema.parse(deckDocument.data());

  const deck = {
    ...parsedDeck,
    createdAt: parsedDeck.createdAt.toDate().toISOString()
  };

  return {
    props: { deck }
  };
}
