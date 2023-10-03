import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KmsAPI } from '@/dep/kms/kmsHandler';

import { catSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';

import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddCategory({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CategoryName: '',
      CategoryParentID: '',
      CategoryDescription: '',
    },
    resolver: yupResolver(catSchema),
  });

  useOutsideClick(ref, closeModal);

  const handleClose = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 300));
      fetchData();
      alertAdd(response);
      handleClose();
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={openModal}
        className=" bg-gray-100 ml-2 hover:bg-gray-300 border-white border"
      >
        +
      </Button>

      {/* Overlay */}
      <div
        className={`fixed inset-0  backdrop-blur-sm bg-black bg-opacity-50 ${
          isModalOpen ? 'visible z-20' : 'invisible'
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex  justify-center items-center ${
          isModalOpen ? 'visible z-30' : 'invisible'
        }`}

      >
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh] mx-2" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            { closeIcon }
          </button>
          <h2 className="text-2xl font-semibold mb-2">Add Category</h2>
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
                      placeholder="Parent"
                    />
                    <p className="text-xs mt-1">
                      Min 2 characters & Max 50 characters. Required.
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
                    <p className="text-xs mt-1">
                      Input a valid Characters Parent ID. Number Only. Required.
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                      placeholder="This is a Parent category that does...."
                    />
                    <p className="text-xs mt-1">
                      Give a brief explanation of the category.
                    </p>
                    {errors.CategoryDescription && (<ErrorMessage error={errors.CategoryDescription.message} />)}
                  </>
                )}
              />
            </div>
            <div className="place-content-end mt-10 flex">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2 w-full md:w-36"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-500 text-white w-full md:w-36"
              >
                Add
              </Button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
