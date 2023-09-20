import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { permSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  useOutsideClick, useModal, alertAdd,
} from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddPermission({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CategoryID: '',
      RoleID: '',
      Create: false,
      Read: false,
      Update: false,
      Delete: false,
      FileType: '',
      DocType: '',
    },
    resolver: yupResolver(permSchema),
  });

  useOutsideClick(ref, closeModal);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      // change filetype and doctype to an []string
      const splitAndTrim = (value) => {
        if (typeof value === 'string') {
          return value.split(',').map((item) => item.trim());
        }
        return value;
      };

      formData.FileType = splitAndTrim(formData.FileType);
      formData.DocType = splitAndTrim(formData.DocType);

      const { error } = permSchema.validate(formData);
      if (error) {
        console.error('Validation error:', error.details);
        return;
      }
      const response = await KmsAPI('POST', 'permission', formData);
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
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh] overflow-y-auto max-h-[80vh] mx-2" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            { closeIcon }
          </button>
          <h2 className="text-2xl font-semibold mb-2">Add Permission</h2>
          <Separator className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Category ID
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="CategoryID"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className=" text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Category ID"
                    />
                    <p className="text-xs mt-1">
                      Input a valid Category ID. Number Only. Required.
                    </p>
                    {errors.CategoryID && (<ErrorMessage error={errors.CategoryID.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Role ID
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="RoleID"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Role ID"
                    />
                    <p className="text-xs mt-1">
                      Input a valid Role ID. Number Only. Required.
                    </p>
                    {errors.RoleID && (<ErrorMessage error={errors.RoleID.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium mb-1">Action Permissions</label>
              <div className="grid grid-cols-2 gap-2 md:w-1/2 w-full">
                <div>
                  <Controller
                    name="Create"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4"
                        />
                        <span className="text-sm sm:text-base">Create</span>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="Read"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500  w-6 h-6 md:w-4 md:h-4"
                        />
                        <span className="text-sm sm:text-base">Read</span>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="Update"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500  w-6 h-6 md:w-4 md:h-4"
                        />
                        <span className="text-sm sm:text-base">Update</span>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="Delete"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4"
                        />
                        <span className="text-sm sm:text-base">Delete</span>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">File Type</label>
              <Controller
                name="FileType"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="*, php, py, -exe"
                    />
                    <p className="text-xs mt-1">
                      Format : * for accept all, - to exclude.
                      <br />
                      example : *, -exe means all allowed except .exe files.
                      <br />
                      example : php, -py means accept .php and exclude .py, and exclude all file type
                    </p>
                    {errors.FileType && (<ErrorMessage error={errors.FileType.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Document Type</label>
              <Controller
                name="DocType"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="*, doc, docx, -pdf"
                    />
                    <p className="text-xs mt-1">
                      Format : * for accept all, - to exclude.
                      <br />
                      example : *, -doc means all allowed except .doc document type.
                      <br />
                      example : doc, pdf, -docx means accepting .doc, .pdf and exclude .docx, and exclude all document type.
                    </p>
                    {errors.DocType && (<ErrorMessage error={errors.DocType.message} />)}
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
                Add Permission
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPermission;
