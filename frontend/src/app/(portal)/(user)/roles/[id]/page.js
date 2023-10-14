/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic'
import { CoreAPIGET, CoreAPI } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import { roleSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/select/RoleSelector';

function UserDetails({ params }) {
  const [defValRoleParent, setDefValRoleParent] = useState();
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      RoleID: '',
      RoleName: '',
      RoleDescription: '',
      RoleParentSelector: '',
    },
    resolver: yupResolver(roleSchema),
  });

  const [selectedRole, setSelectedRole] = useState({
    value: 1,
    label: 'Everyone',
  });
  const handleRoleChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedRole(selectedOption);
  };

  const fetchUserData = async () => {
    try {
      const response = await CoreAPIGET(`role?RoleID=${params.id}`);
      const { Data } = response.body;
      Object.keys(Data).forEach((key) => {
        setValue(key, Data[key]);
      });
      // console.log('passed here');
      // setValue('RoleParentSelector', {
      //   value: response.body.Data.RoleParentID,
      //   label: response.body.Data.RoleParentName,
      // });
      setDefValRoleParent({
        value: response.body.Data.RoleParentID,
        label: response.body.Data.RoleParentName,
      });
      // console.log('passed here2');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [params.id, setValue]);

  const onSubmit = async (formData) => {
    try {
      const { error } = roleSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const updatedData = {
        RoleID: formData.RoleID,
        RoleName: formData.RoleName,
        RoleParentID: selectedRole.value,
        RoleDescription: formData.RoleDescription,
      };
      const response = await CoreAPI('PUT', 'role', updatedData);
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
        <h2 className="text-2xl font-semibold mb-1">Edit Role</h2>
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
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Role Parent
              {' '}
              <RequiredFieldIndicator />
            </label>
            {/* <Controller
              name="RoleParentSelector"
              render={({ field }) => (
                <RoleSelector
                  {...field}
                  onChange={handleRoleChange}
                  value={defValRoleParent}
                />
              )}
              control={control}
            /> */}
            <RoleSelector id="RoleParentSelector" onChange={handleRoleChange} value={defValRoleParent} />
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white w-full md:w-36"
          >
            Update Role
          </Button>
        </form>
      </div>
      {/* { console.log('Updated selectedRole:', defValRoleParent)} */}
    </section>
  );
}

export default UserDetails;
