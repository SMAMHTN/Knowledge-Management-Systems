'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import { permSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/select/RoleSelector';
import CategorySelector from '@/components/select/CategorySelector';

function PermissionDetail({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      PermissionID: '',
      Create: false,
      Read: false,
      Update: false,
      Delete: false,
      FileType: '',
      DocType: '',
    },
    resolver: yupResolver(permSchema),
  });

  const [data, setData] = useState([]);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await KmsAPIGET(`permission?PermissionID=${params.id}`);
        setData(response.body.Data);
        console.log(response);
        Object.keys(response.body.Data).forEach((key) => {
          setValue(key, response.body.Data[key]);
        });
        setSelectedCategory({
          value: response.body.Data.CategoryID,
          label: response.body.Data.CategoryName,
        });
        setSelectedRole({
          value: response.body.Data.RoleID,
          label: response.body.Data.RoleName,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [params.id, setValue]);

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
        PermissionID: formData.PermissionID,
        CategoryID: selectedCategory.value,
        RoleID: selectedRole.value,
        Create: formData.Create,
        Read: formData.Read,
        Update: formData.Update,
        Delete: formData.Delete,
        DocType: ChangedDocType,
        FileType: ChangedFileType,
      };

      const response = await KmsAPI('PUT', 'permission', updatedData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.error(error);
      console.error('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1"> Edit Permission</h2>
        <p className="text-xs mb-4 ">
          Customize and manage your Permission details
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Category ID
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
          <div className="mb-4">
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
                    example : php, -py accept .php and exclude .py, and exclude all file type.
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white w-full md:w-36"
          >
            Update Permission
          </Button>
        </form>
      </div>

    </section>
  );
}

export default PermissionDetail;
