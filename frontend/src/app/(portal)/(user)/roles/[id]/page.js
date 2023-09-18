'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CoreAPIGET, CoreAPI } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import { roleSchema } from '@/constants/schema';
import { ErrorMessage } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function UserDetails({ params }) {
  const {
    handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      RoleID: '',
      RoleName: '',
      RoleParentID: '',
      RoleDescription: '',
    },
    resolver: yupResolver(roleSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET(`role?RoleID=${params.id}`);
        const { Data } = response.body;

        Object.keys(Data).forEach((key) => {
          setValue(key, Data[key]);
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [params.id, setValue]);

  const onSubmit = async (formData) => {
    try {
      const { error } = roleSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await CoreAPI('PUT', 'role', formData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-col flex-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bol mb-1">Role Edit</h2>
        <p className="text-xs mb-4">
          Customize and manage your role details.
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">Role Name</label>
            <Controller
              name="RoleName"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="Role Name"
                  />
                  <p className="text-xs mt-1">
                    This is Role Name. Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.RoleName && (<ErrorMessage error={errors.RoleName.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Role Parent ID</label>
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
                    This is Role Parent ID. Number Only. Required.
                  </p>
                  {errors.RoleParentID && (<ErrorMessage error={errors.RoleParentID.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Description</label>
            <Controller
              name="RoleDescription"
              control={control}
              render={({ field }) => (
                <>
                  <textarea
                    {...field}
                    type="textarea"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                    placeholder="Role Description"
                  />
                  <p className="text-xs mt-1">
                    Give a brief explanation of the role
                  </p>
                  {errors.RoleDescription && (<ErrorMessage error={errors.RoleDescription.message} />)}
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white"
          >
            Update Role
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UserDetails;
