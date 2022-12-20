import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { authClient } from '../firebase/firebaseClient';
import { useAuthSignInWithEmailAndPassword } from '@react-query-firebase/auth';

interface SignInInputs {
  email: string;
  password: string;
}

export default function SignIn() {
  const { push } = useRouter();
  const { mutate, isLoading } = useAuthSignInWithEmailAndPassword(authClient);

  const [inputs, setInputs] = useState<SignInInputs>({
    email: '',
    password: ''
  });

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: e.currentTarget.value
    });
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        email: inputs.email,
        password: inputs.password
      },
      {
        async onSuccess({ user }) {
          const token = await user.getIdToken();
          console.log(token);
          document.cookie = `flash-card=${token}`;
          push('/');
        }
      }
    );
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleOnSubmit}>
        <label htmlFor="email">
          <input
            type="text"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleOnChange}
            placeholder="Username"
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleOnChange}
            placeholder="Password"
            required
          />
        </label>
        <br />
        {isLoading ? <p>Loading...</p> : <button type="submit">Sign In</button>}
      </form>
      <p>
        Dont have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
