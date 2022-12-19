import Link from 'next/link';
import { db } from '../firebase/admin';
import { Deck, deckSchema } from '../schema/deck';

interface Props {
  decks: Deck[];
}

export default function HomePage({ decks }: Props) {
  return (
    <div>
      <h1>Home Page</h1>
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
    </div>
  );
}

export async function getServerSideProps() {
  const document = await db.collection('decks').orderBy('createdAt').get();

  const decks = document.docs.map((deck) => deckSchema.parse(deck.data()));

  return {
    props: { decks: JSON.parse(JSON.stringify(decks)) }
  };
}
