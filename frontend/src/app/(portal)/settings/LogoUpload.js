import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

function LogoUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    event.preventDefault();
    console.log('Upload button clicked in LogoUpload');
    if (selectedFile) {
      // Convert the selected image to base64 here
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        // Call the provided onUpload function with the base64 string
        if (onUpload && typeof onUpload === 'function') {
          onUpload(base64String);
        } else {
          console.error('onUpload is not a valid function.');
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div className="flex flex-col">

      <input
        className="block px-2 py-1 md:max-w-md mb-1 text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        accept=".jpg, .jpeg, .png"
        type="file"
        onChange={handleFileChange}
      />
      <p className="text-xs mt-1 mb-4">
        Upload a file from your device. Image should be a .jpg, .jpeg, .png file
      </p>
      <Button
        type="button"
        onClick={handleUpload}
        className="rounded bg-blue-500 text-white w-full md:w-36"
      >
        Upload logo
      </Button>
    </div>
  );
}

export default LogoUpload;
