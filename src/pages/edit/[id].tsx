import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { db } from '../../firebase/admin';
import { Deck, deckSchema } from '../../schema/deck';

interface Props {
  deck: Deck;
}

export default function EditPage({ deck }: Props) {
  return (
    <div>
      <h1>Edit Page</h1>
      <p>{deck.id}</p>
      <p>{deck.title}</p>
      <p>{deck.description}</p>
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

  const document = await db.collection('decks').doc(id).get();

  const deck = deckSchema.parse(document.data());

  return {
    props: { deck: JSON.parse(JSON.stringify(deck)) }
  };
}
