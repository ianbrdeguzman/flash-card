import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';

export default function EditPage({
  id
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>Edit Page</h1>
      <p>{id}</p>
      <Link href="/">Home</Link>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id;

  return {
    props: {
      id
    }
  };
}
