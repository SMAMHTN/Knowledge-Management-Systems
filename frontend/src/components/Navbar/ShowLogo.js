'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import { CoreAPIGET } from '../../dep/core/coreHandler';

function ShowLogo({ maxWidth, maxHeight }) {
  const [error, setError] = useState('');
  const [data, setData] = useState({
    CompanyLogo: '',
  });
  const [companyName, setCompanyName] = useState('');

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET('setting');
      const jsonData = response.body.Data;
      setData(jsonData);
      setCompanyName(jsonData.CompanyName);
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
    <div className="flex items-center h-9 object-contain">
      <div className="hidden md:block">{renderCompanyLogo()}</div>
      <span className="hidden md:block ml-2 text-gray-600">{companyName}</span>
    </div>
  );
}

export default ShowLogo;
