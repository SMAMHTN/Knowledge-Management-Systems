import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import { alertAdd } from './Feature';

function UploadDoc(categoryID) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const categoryIdValue = categoryID.categoryID;

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log('Upload button clicked in UploadDoc');
    try {
      console.log(categoryID);
      const updatedData = {
        File: selectedFile,
        CategoryID: categoryIdValue,
      };
      console.log(updatedData);
      const response = await KmsAPI('POST', 'doc', updatedData);
      alertAdd(response);
      console.log(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-5 grid-rows-2 gap-4">
        <div className="col-span-3">
          <input
            className="block px-2 py-2 w-full md:w-3/4 text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            accept="*/*"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-start-4 col-span-2">
          {' '}
          <Button
            type="button"
            onClick={handleUpload}
            className="rounded bg-blue-500 text-white w-full md:w-36"
          >
            Upload Document
          </Button>

        </div>
        <div className="col-span-5 row-start-2">
          {' '}
          <p className="text-xs mt-1 mb-4">
            Upload a document from your device. Image should be a .jpg, .jpeg, .png file. Notes: to use the uploaded document on this article you need to click the upload button.
          </p>

        </div>
      </div>
    </div>
  );
}

export default UploadDoc;
