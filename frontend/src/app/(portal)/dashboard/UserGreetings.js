'use client';

import { useState, useEffect } from 'react';
import { getUserData } from '@/dep/core/coreHandler';
import { Separator } from '@/components/SmComponent';

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
    <div className="bg-white rounded-md shadow  px-4 py-2 mb-2">
      <h2 className="text-2xl font-semibold mb-1">Dashboard</h2>
      {userData ? (
        <p className="mb-1 font-medium">
          Welcome &nbsp;
          {userData.Name ? userData.Name : 'User'}
        </p>
      ) : (
        <p className="mb-1 font-medium">
          Welcome &nbsp;
          User
        </p>
      )}
      <Separator />
    </div>
  );
}

export default UserGreetings;
