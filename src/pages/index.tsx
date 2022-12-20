import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { authAdmin, firestoreAdmin } from '../firebase/firebaseAdmin';
import { collections } from '../firebase/collections';
import { Deck, deckSchema } from '../schema/deck';
import { useAuthSignOut, useAuthUser } from '@react-query-firebase/auth';
import { authClient } from '../firebase/firebaseClient';

interface Props {
  decks: Deck[];
}

export default function HomePage({ decks }: Props) {
  const user = useAuthUser(['user'], authClient);
  const { mutate: signOut } = useAuthSignOut(authClient);

  const handleSignOut = () => {
    signOut();
    document.cookie = `flash-card=;expires=Thu, 01 Jan 1970 00:00:01 GMT"`;
    window.location.reload();
  };

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
      <br />
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies['flash-card'];

  if (!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };
  }

  const isSignedIn = await authAdmin.verifyIdToken(token);

  if (!isSignedIn) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };
  }

  const decksDocument = await firestoreAdmin
    .collection(collections.decks)
    .orderBy('createdAt')
    .get();

  const parsedDecks = decksDocument.docs.map((deck) =>
    deckSchema.parse(deck.data())
  );

  const decks = parsedDecks.map((deck) => ({
    ...deck,
    createdAt: deck.createdAt.toDate().toISOString()
  }));

  return {
    props: { decks }
  };
}
