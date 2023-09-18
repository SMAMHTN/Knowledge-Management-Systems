'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import { permSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function PermissionDetail({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
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

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await KmsAPIGET(`permission?PermissionID=${params.id}`);
        setData(response.body.Data);

        // Pre-fill the form fields with data values
        Object.keys(response.body.Data).forEach((key) => {
          if (key !== 'PermissionID') {
            // Ensure FileType is an array
            if (key === 'FileType' && typeof response.body.Data[key] === 'string') {
              setValue(key, response.body.Data[key].split(',').map((item) => item.trim()));
            } else {
              setValue(key, response.body.Data[key]);
            }
          }
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

      formData.FileType = splitAndTrim(formData.FileType);
      formData.DocType = splitAndTrim(formData.DocType);

      const { error } = permSchema.validate(formData);
      if (error) {
        console.error('Validation error:', error.details);
        return;
      }
      const response = await KmsAPI('PUT', 'permission', formData);
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
            <label className="block font-medium mb-1">Permission ID</label>
            <input
              type="text"
              value={data.PermissionID || ''}
              className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
              placeholder="Permission ID"
              readOnly
            />
          </div>
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
          <div className="mb-4">
            <label className="block font-medium mb-1">Action Permissions</label>
            <div className="grid grid-cols-2 gap-2 w-1/2">
              <div>
                <Controller
                  name="Create"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        className="mr-2 text-blue-500"
                      />
                      <span className="text-sm sm:text-base">Create</span>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="Read"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        className="mr-2 text-blue-500"
                      />
                      <span className="text-sm sm:text-base">Read</span>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="Update"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        className="mr-2 text-blue-500"
                      />
                      <span className="text-sm sm:text-base">Update</span>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="Delete"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        className="mr-2 text-blue-500"
                      />
                      <span className="text-sm sm:text-base">Delete</span>
                    </>
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
            className="rounded bg-blue-500 text-white"
          >
            Update Permission
          </Button>
        </form>
      </div>

    </section>
  );
}

export default PermissionDetail;
