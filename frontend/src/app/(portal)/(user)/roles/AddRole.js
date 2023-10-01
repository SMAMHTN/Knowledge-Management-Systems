import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CoreAPI } from '@/dep/core/coreHandler';

import { roleSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';

import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddRole({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      RoleName: '',
      RoleParentID: '',
      RoleDescription: '',
    },
    resolver: yupResolver(roleSchema),
  });

  useOutsideClick(ref, closeModal);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (formData) => {
    try {
      const { error } = roleSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await CoreAPI('POST', 'role', formData);
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
        className=" bg-gray-100 ml-2"
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
        className={`fixed inset-0 flex justify-center items-center ${
          isModalOpen ? 'visible z-30' : 'invisible'
        }`}

      >
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh] mx-2" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            {closeIcon}
          </button>
          <h2 className="text-2xl font-medium mb-2">Add Role</h2>
          <Separator className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Role Name
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="RoleName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Public"
                    />
                    <p className="text-xs mt-1">
                      Min 2 characters & Max 50 characters. Required.
                    </p>
                    {errors.RoleName && (<ErrorMessage error={errors.RoleName.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Role Parent ID
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="RoleParentID"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                      placeholder="Role Parent ID"
                    />
                    <p className="text-xs mt-1">
                      Input a valid Role Parent ID. Number Only. Required.
                    </p>
                    {errors.RoleParentID && (<ErrorMessage error={errors.RoleParentID.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Description
              </label>
              <Controller
                name="RoleDescription"
                control={control}
                render={({ field }) => (
                  <>
                    <textarea
                      {...field}
                      type="textarea"
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                      placeholder="Designed for public"
                    />
                    <p className="text-xs mt-1">
                      Give a brief explanation of the role.
                    </p>
                    {errors.RoleDescription && (<ErrorMessage error={errors.RoleDescription.message} />)}
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

export default AddRole;
