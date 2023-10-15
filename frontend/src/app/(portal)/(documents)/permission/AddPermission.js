import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { permSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import RoleSelector from '@/components/select/RoleSelector';
import CategorySelector from '@/components/select/CategorySelector';
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

  const [selectedCategory, setSelectedCategory] = useState({
    value: 1,
    label: 'Public',
  });
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const [selectedRole, setSelectedRole] = useState({
    value: 1,
    label: 'Everyone',
  });
  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
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

      const ChangedFileType = splitAndTrim(formData.FileType);
      const ChangedDocType = splitAndTrim(formData.DocType);

      const { error } = permSchema.validate(formData);
      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const updatedData = {
        CategoryID: selectedCategory.value,
        RoleID: selectedRole.value,
        Create: formData.Create,
        Read: formData.Read,
        Update: formData.Update,
        Delete: formData.Delete,
        DocType: ChangedDocType,
        FileType: ChangedFileType,
      };

      const response = await KmsAPI('POST', 'permission', updatedData);
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
      <Button type="button" onClick={openModal} className=" bg-gray-100 ml-2 hover:bg-gray-300 border border-white">
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
                Category
                <RequiredFieldIndicator />
              </label>
              <CategorySelector onChange={handleCategoryChange} value={selectedCategory} />
              <p className="text-xs mt-1">
                Select Category. Required.
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Role ID
                <RequiredFieldIndicator />
              </label>
              <RoleSelector onChange={handleRoleChange} value={selectedRole} />
              <p className="text-xs mt-1">
                Select Role. Required.
              </p>
            </div>
            <div className="mb-2">
              <label className="block font-medium mb-1">Action Permissions</label>
              <div className="grid grid-cols-2 gap-4 md:w-1/2 w-full">
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
                className="rounded bg-blue-500 hover:bg-blue-600 text-white w-full md:w-36"
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
