import React, { useState, useRef } from 'react';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';

function AddArticle({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    OwnerID: 7,
    LastEditedByID: 7,
    LastEditedTime: '2023-03-24T13:47:51Z',
    Tag: '[Game,Kuliah,Suffering]',
    Title: 'Kesalahan a',
    CategoryID: 1,
    Article: 'Normandy battle',
    FileID: '[]',
    DocID: '[]',
    IsActive: 1,
  });

  useOutsideClick(ref, closeModal);

  const handleInputChange = (e) => {
    const {
      name, value, type, checked,
    } = e.target;
    let parsedValue;

    // Handle checkbox input
    if (type === 'checkbox') {
      parsedValue = checked ? 1 : 0;
    } else if (name === 'DocID' || name === 'FileID') {
      parsedValue = value === '' ? '[]' : `[${value}]`;
    } else if (name === 'OwnerID' || name === 'LastEditedByID' || name === 'CategoryID') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    } else {
      parsedValue = value;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };
  const handleCancel = () => {
    setFormData({
      OwnerID: 7,
      LastEditedByID: 7,
      LastEditedTime: '2023-03-24T13:47:51Z',
      Tag: '[Game,Kuliah,Suffering]',
      Title: 'Kesalahan a',
      CategoryID: 1,
      Article: 'Normandy battle',
      FileID: '[]',
      DocID: '[]',
      IsActive: 1,
    });
    closeModal();
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log(formData);
    try {
      // Make the API call to save the data
      const response = await KmsAPI('POST', 'article', formData);
      alertAdd(response);
      fetchData(); // Assuming fetchData is a function that fetches data again
    } catch (error) {
      console.log('Error occurred:', error);
      // Handle error, show a message, etc.
    }

    // Close the modal
    closeModal();
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New +
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
          isModalOpen ? 'visible z-20' : 'invisible'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex justify-center items-center ${
          isModalOpen ? 'visible z-30' : 'invisible'
        }`}

      >
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold mb-4">Add Document</h2>
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Article</label>
              <input
                type="text"
                name="Article"
                value={formData.Article}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">CategoryID</label>
              <input
                type="text"
                name="CategoryID"
                value={formData.CategoryID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">OwnerID</label>
              <input
                type="text"
                name="OwnerID"
                value={formData.OwnerID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">LastEditedByID</label>
              <input
                type="text"
                name="LastEditedByID"
                value={formData.LastEditedByID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                LastEditedTime
                <input
                  type="text"
                  name="LastEditedTime"
                  value={formData.LastEditedTime}
                  onChange={handleInputChange}
                  className="border px-2 py-1 w-full"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tag</label>
              <input
                type="text"
                name="Tag"
                value={formData.Tag}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">FileID</label>
              <input
                type="text"
                name="FileID"
                value={formData.FileID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">DocID</label>
              <input
                type="text"
                name="DocID"
                value={formData.DocID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData.IsActive === 1}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                IsActive
              </label>
            </div>
            <div className="place-content-end mt-10 flex">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddArticle;

// "use client";
// import React, { useState } from "react";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { KmsAPI } from "@/dep/kms/kmsHandler";

// function AddProduct() {
//   const [formData, setFormData] = useState({
//     CategoryName: "",
//     CategoryParentID: "",
//     CategoryDescription: "",
//   });
//   const [modal, setModal] = useState(false);
//   const [isMutating, setIsMutating] = useState(false);

//   const router = useRouter();

//   function handleSubmit(e) {
//     e.preventDefault();

//     setIsMutating(true);

// // Use useEffect to fetch data
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       await KmsAPI("POST", "category", data);
//       setIsMutating(false);
//       router.refresh();
//       setModal(false);
//     } catch (error) {
//       console.log("Error occurred:", error);
//       setIsMutating(false);
//       // Handle error, show a message, etc.
//     }
//   };

//   fetchData();
// }, [data, router]); // Add data and router as dependencies for useEffect
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   function handleChange() {
//     setModal(!modal);
//   }

//   return (
//     <div>
//       <button  onClick={handleChange} className="bg-blue-500 text-white rounded px-2 py-1">
//         Add New +
//       </button>
//       <input
//         type="checkbox"
//         checked={modal}
//         onChange={handleChange}
//         className="modal-toggle"
//       />

//       <div className="modal">
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">Add New Product</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-control">
//               <label className="label font-bold">CategoryName</label>
//               <input
//                 type="text"
//                 value={formData.CategoryName}
//           onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Product Name"
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-bold">Price</label>
//               <input
//                 type="text"
//                 value={formData.CategoryParentID}
//           onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Price"
//               />
//             </div>
//             <div className="form-control">
//               <label className="label font-bold">Price</label>
//               <input
//                 type="text"
//                 value={formData.CategoryDescription}
//                 onChange={handleInputChange}
//                 className="input w-full input-bordered"
//                 placeholder="Price"
//               />
//             </div>
//             <div className="modal-action">
//               <button type="button" className="btn" onClick={handleChange}>
//                 Close
//               </button>
//               {!isMutating ? (
//                 <button type="submit" className="btn btn-primary">
//                   Save
//                 </button>
//               ) : (
//                 <button type="button" className="btn loading">
//                   Saving...
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;
