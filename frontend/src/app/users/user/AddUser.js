import React, { useState, useRef } from 'react';
import { CoreAPI } from '../../../dep/core/coreHandler';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';

function AddUser({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    Username: 'smam',
    Password: 'smam',
    Name: 'Aldi Mulyawan',
    Email: 'aldismartkid@gmail.com',
    Address: 'Blora',
    Phone: '081350488901',
    RoleID: 3,
    AppthemeID: 1,
    Note: 'INI PERCOBAAN',
    IsSuperAdmin: 0,
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
    } else if (name === 'DocType' || name === 'FileType') {
      parsedValue = value === '' ? '[]' : `[${value}]`;
    } else if (name === 'CategoryID' || name === 'RoleID') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    } else {
      parsedValue = value === '' ? 0 : value;
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
      const response = await CoreAPI('POST', 'user', formData);
      alertAdd(response);
      fetchData(); // Assuming fetchData is a function that fetches data again
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
          <h2 className="text-2xl font-semibold mb-4">Add User</h2>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Username</label>
                  <input
                    type="text"
                    name="Username"
                    value={formData.Username}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Password</label>
                  <input
                    type="text"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="text"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">RoleID</label>
                  <input
                    type="text"
                    name="RoleID"
                    value={formData.RoleID}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">AppthemeID</label>
                  <input
                    type="text"
                    name="AppthemeID"
                    value={formData.AppthemeID}
                    onChange={handleInputChange}
                    className="border px-2 py-1 w-full"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Note</label>
              <input
                type="text"
                name="Note"
                value={formData.Note}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">
                  <input
                    type="checkbox"
                    name="IsSuperAdmin"
                    checked={formData.IsSuperAdmin === 1}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  IsSuperAdmin
                </label>
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

export default AddUser;

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
