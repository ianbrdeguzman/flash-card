import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '../firebase/firebaseClient';
import { useAuthCreateUserWithEmailAndPassword } from '@react-query-firebase/auth';

interface RegisterInputs {
  email: string;
  password: string;
}

export default function Register() {
  const { mutate, isLoading, isSuccess } =
    useAuthCreateUserWithEmailAndPassword(authClient);
  const [inputs, setInputs] = useState<RegisterInputs>({
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
        onSuccess() {
          setInputs({
            email: '',
            password: ''
          });
        }
      }
    );
  };

  return (
    <div>
      <h1>Register</h1>
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
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <button type="submit">Register</button>
        )}
      </form>
      {isSuccess && <p>Register Successful.</p>}
      <p>
        Already have an account? <Link href="/signin">Sign In</Link>
      </p>
    </div>
  );
}
