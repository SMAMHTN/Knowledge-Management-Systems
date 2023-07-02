"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const credentials = btoa(`aldim:${password}&&${username}`);

    try {
      const response = await fetch('http://code.smam.my.id:6565/login', {
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setMessage('Login successful!');
        router.push("/btest");
      } else {
        setMessage('Login failed!');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="text-black"
      />
      <button onClick={() => handleLogin()}>Login</button>
      <p>{message}</p>
    </div>
  );
}
