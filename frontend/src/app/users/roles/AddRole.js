import React, { useState, useRef } from 'react';
import { CoreAPI } from '../../../dep/core/coreHandler';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';

function AddRole({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    RoleName: 'testing23.3',
    RoleParentID: 3,
    RoleDescription: '11/08/23',
  });

  useOutsideClick(ref, closeModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value; // Initialize parsedValue with the original value

    // Convert to integer if the input field name suggests it
    if (name === 'RoleParentID') {
      parsedValue = parseInt(value, 10);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make the API call to save the data
      console.log(formData);
      const response = await CoreAPI('POST', 'role', formData);
      alertAdd(response);
      fetchData();
      closeModal();
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
          <h2 className="text-2xl font-semibold mb-4">Add Roles</h2>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">RoleName</label>
              <input
                type="text"
                name="RoleName"
                value={formData.RoleName}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">RoleParentID</label>
              <input
                type="text"
                name="RoleParentID"
                value={formData.RoleParentID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">RoleDescription</label>
              <input
                type="text"
                name="RoleDescription"
                value={formData.RoleDescription}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRole;

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
