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
    <div>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
      />
      {imagePreview && (
        <div>
          {/* Use the Next.js Image component */}
          <Image
            src={imagePreview}
            alt="Preview"
            width={200} // Set the width
            height={200} // Set the height
            objectFit="contain" // Set the object fit mode
          />
        </div>
      )}
      <button
        onClick={handleUpload}
        style={{
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Upload
      </button>
    </div>
  );
}

export default LogoUpload;
