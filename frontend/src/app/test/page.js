'use client';
import { useState } from 'react';

export default function Page() {
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
        // Perform any additional actions after successful login
      } else {
        setMessage('Login failed!');
        // Handle login failure
      }
    } catch (error) {
      setMessage('An error occurred during login.');
      // Handle error
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
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  )
}