import Link from 'next/link';
import { db } from '../firebase/admin';
import { collections } from '../firebase/collections';
import { Deck, deckSchema } from '../schema/deck';

interface Props {
  decks: Deck[];
}

export default function HomePage({ decks }: Props) {
  return (
    <div>
      <h1>Home</h1>
      {decks.length === 0 ? (
        <p>No decks available</p>
      ) : (
        <ul>
          {decks.map(({ id, title }) => {
            return (
              <li key={id}>
                <Link href={`/edit/${id}`}>
                  <p>{title}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Link href={`/create`}>Create</Link>
    </div>
  );
}

export async function getServerSideProps() {
  const document = await db
    .collection(collections.decks)
    .orderBy('createdAt')
    .get();

  const parsed = document.docs.map((deck) => deckSchema.parse(deck.data()));

  const decks = parsed.map((deck) => ({
    ...deck,
    createdAt: deck.createdAt.toDate().toISOString()
  }));

  return {
    props: { decks }
  };
}
