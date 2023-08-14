'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import { CoreAPIGET } from '../dep/core/coreHandler';

function ShowLogo({ maxWidth, maxHeight }) {
  const [error, setError] = useState('');
  const [data, setData] = useState({
    CompanyLogo: '',
  });

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET('setting');
      const jsonData = response.body.Data;
      setData(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to check if a string is a valid base64 string
  const isValidBase64 = (str) => {
    try {
      // Attempt to decode the base64 string
      atob(str);
      return true; // If successful, it's a valid base64 string
    } catch (e) {
      return false; // If an error occurs, it's not a valid base64 string
    }
  };

  const renderCompanyLogo = () => {
    if (data && data.CompanyLogo && isValidBase64(data.CompanyLogo)) {
      return (
        <Image
          src={`data:image;base64,${data.CompanyLogo}`}
          alt="Company Logo"
          height={500}
          width={500}
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
      <div>{renderCompanyLogo()}</div>
    </div>
  );
}

export default ShowLogo;
