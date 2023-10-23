'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/dep/core/coreHandler';

function UserGreetings() {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState('');
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
      {userData ? (
        <p className="mb-4 font-medium">
          Welcome &nbsp;
          {userData.Name ? userData.Name : 'User'}
        </p>
      ) : (
        <p className="mb-4 font-medium">
          Welcome &nbsp;
          User
        </p>
      )}
    </div>
  );
}

export default UserGreetings;
