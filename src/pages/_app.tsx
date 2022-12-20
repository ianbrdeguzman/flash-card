import type { AppProps } from 'next/app';
import { Nunito } from '@next/font/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CustomHead } from '../components/Head';
import '../styles/globals.css';

const nunito = Nunito({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CustomHead />
      <QueryClientProvider client={queryClient}>
        <main className={nunito.className}>
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </>
  );
}
