import Head from 'next/head';
import type { AppProps } from 'next/app';
import { Nunito } from '@next/font/google';
import '../styles/globals.css';
import Link from 'next/link';

const nunito = Nunito({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flash Card</title>
        <meta name="description" content="Flash Card App" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"
        ></link>
      </Head>
      <main className={nunito.className}>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/create">Create</Link>
            </li>
          </ul>
        </nav>
        <Component {...pageProps} />
      </main>
    </>
  );
}
