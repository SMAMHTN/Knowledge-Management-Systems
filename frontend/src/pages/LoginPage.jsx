import React, { useState } from 'react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('http://code.smam.my.id:6565/loginuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const { StatusCode, Data } = await response.json();
  
        if (StatusCode === 200) {
          localStorage.setItem('user', JSON.stringify(Data));
          window.location.href = '/homepage';
        } else {
          setError('Invalid username or password');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };
  
  

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
