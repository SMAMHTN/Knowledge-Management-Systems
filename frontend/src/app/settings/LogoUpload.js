import React, { useState } from 'react';
import Image from 'next/image'; // Import the Next.js Image component

function LogoUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Display a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Convert the selected image to base64
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
    <div className="flex items-center">
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded ml-2"
      >
        Upload
      </button>
    </div>

  );
}

export default LogoUpload;
