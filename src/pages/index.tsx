import Link from 'next/link';
import { useRouter } from 'next/router';
import { firestoreAdmin } from '../firebase/firebaseAdmin';
import { collections } from '../firebase/collections';
import { deleteCookie } from 'cookies-next';
import { Deck, deckSchema } from '../schema/deck';
import {
  useAuthSignOut,
  useAuthUser,
  useAuthSendEmailVerification
} from '@react-query-firebase/auth';
import { authClient } from '../firebase/firebaseClient';
import { withAuth } from '../lib/withAuth';

interface Props {
  decks: Deck[];
}

export default function HomePage({ decks }: Props) {
  const { push } = useRouter();
  const { data: user } = useAuthUser(['user'], authClient);
  const { mutate: signOut } = useAuthSignOut(authClient);
  const { mutate: sendEmailVerification } = useAuthSendEmailVerification();

  const handleSignOut = () => {
    signOut();
    deleteCookie('auth');
    push('/signin');
  };

  const handleVerifyOnClick = () => {
    if (user) {
      sendEmailVerification(
        {
          user,
          actionCodeSettings: {
            url: 'http://localhost:3000/'
          }
        },
        {
          onSuccess() {
            console.log('email sent...');
          }
        }
      );
    }
  };

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Signed in as {user?.email}</h1>
      {!user.emailVerified && (
        <button onClick={handleVerifyOnClick}>Verify email</button>
      )}
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

export const getServerSideProps = withAuth(async () => {
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
});
