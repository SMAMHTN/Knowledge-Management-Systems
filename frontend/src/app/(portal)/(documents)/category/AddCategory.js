import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KmsAPI } from '@/dep/kms/kmsHandler';

import { catSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddCategory({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, setValue, getValues, reset, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CategoryName: '',
      CategoryParentID: '',
      CategoryDescription: '',
    },
    resolver: yupResolver(catSchema),
  });

  useOutsideClick(ref, closeModal);

  const handleCancel = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      const { error } = catSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await KmsAPI('POST', 'category', formData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alertAdd(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
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
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh]" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={() => { handleCancel(); }}
          >
            { closeIcon }
          </button>
          <h2 className="text-2xl font-bold mb-2">Add Category</h2>
          <Separator className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Category Name
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="CategoryName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Category Name"
                    />
                    <p className="text-xs my-1">
                      This is Category Name. Min 2 characters & Max 50 characters. Required.
                    </p>
                    {errors.CategoryName && (<ErrorMessage error={errors.CategoryName.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Category Parent ID
                {' '}
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="CategoryParentID"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                      placeholder="Category Parent ID"
                    />
                    <p className="text-xs my-1">
                      This is Category Parent ID. Number Only. Required.
                    </p>
                    {errors.CategoryParentID && (<ErrorMessage error={errors.CategoryParentID.message} />)}
                  </>
                )}
              />
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-1">
                Description
              </label>
              <Controller
                name="CategoryDescription"
                control={control}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      type="textarea"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                      placeholder="Category Description"
                    />
                    <p className="text-xs my-1">
                      Give a brief explanation of the category.
                    </p>
                    {errors.CategoryDescription && (<ErrorMessage error={errors.CategoryDescription.message} />)}
                  </>
                )}
              />
            </div>
            <div className="place-content-end mt-10 flex">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-500 text-white"
              >
                Add Category
              </Button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;

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
