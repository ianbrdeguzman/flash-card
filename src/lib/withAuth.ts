import { authAdmin } from '../firebase/firebaseAdmin';
import { getCookie } from 'cookies-next';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export function withAuth(gssp: GetServerSideProps) {
  return async (context: GetServerSidePropsContext) => {
    const token = getCookie('auth', context) as string;

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

    return await gssp(context);
  };
}
