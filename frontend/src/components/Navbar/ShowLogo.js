'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import { CoreAPIGET } from '../../dep/core/coreHandler';

function DataFetchingComponent({ children }) {
  const [error, setError] = useState('');
  const [data, setData] = useState({
    CompanyLogo: '',
    CompanyName: '', // Include CompanyName in the state
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

  return children({ data, error });
}

// Component to display the company name
export function CompanyName({ data }) {
  return (
    <DataFetchingComponent>
      {({ data, error }) => (
        <span className="ml-2 text-md tracking-wide font-medium">
          {data.CompanyName}
        </span>
      )}
    </DataFetchingComponent>

  );
}

// Component to render the company logo
export function RenderCompanyLogo({ maxWidth, maxHeight, data }) {
  const isValidBase64 = (str) => {
    try {
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  };

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
}

// Main component
function ShowLogo({ maxWidth, maxHeight }) {
  return (
    <DataFetchingComponent>
      {({ data, error }) => (
        <div className="flex items-center h-9 object-contain">
          <RenderCompanyLogo maxWidth={maxWidth} maxHeight={maxHeight} data={data} />
        </div>
      )}
    </DataFetchingComponent>
  );
}

export default ShowLogo;
