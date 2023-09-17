'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getUserData } from '../../dep/core/coreHandler';

export default function ProfileImage({ maxWidth, maxHeight }) {
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUserData();
        if (data.UserPhoto) {
          // Convert base64 to image URL
          const imageBlob = new Blob([new Uint8Array(atob(data.UserPhoto).split('').map((char) => char.charCodeAt(0)))]);
          const imageUrl = URL.createObjectURL(imageBlob);
          data.UserPhotoUrl = imageUrl;
        }
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchData();
  }, []);

  const renderUserPhoto = () => {
    if (userData && userData.UserPhotoUrl) {
      return (
        <Image
          src={userData.UserPhotoUrl}
          alt="UserPhoto"
          height={500}
          width={500}
          className="flex rounded-full"
          style={{
            maxWidth: maxWidth || '100%',
            maxHeight: maxHeight || '100%',
            objectFit: 'contain',
          }}
        />
      );
    }

    return null;
  };
  return (
    <div>
      {renderUserPhoto()}
    </div>
  );
}
