import { InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { db } from '../firebase/admin';

export default function HomePage({
  decks
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

interface Deck {
  id: string;
  title: string;
  description: string;
}

export async function getServerSideProps<Deck>() {
  const decksFromFirebase = await db.collection('decks').get();

  const decks = decksFromFirebase.docs.map((deck) => deck.data());

  return {
    props: { decks }
  };
}
