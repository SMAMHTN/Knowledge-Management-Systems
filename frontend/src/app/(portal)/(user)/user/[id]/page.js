'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CoreAPI, CoreAPIGET } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import { userSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function UserDetails({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Username: '',
      Password: '',
      Name: '',
      Email: '',
      Address: '',
      Phone: '',
      RoleID: '',
      AppthemeID: '',
      Note: '',
      IsSuperAdmin: false,
      IsActive: false,
    },
    resolver: yupResolver(userSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET(`user?UserID=${params.id}`);
        const { Data } = response.body;

        Object.keys(Data).forEach((key) => {
          setValue(key, Data[key]);
        });
      } catch (error) {
        // Handle errors here
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [params.id, setValue]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      const { error } = userSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await CoreAPI('PUT', 'user', formData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">User Edit</h2>
        <p className="text-xs mb-4">
          Customize and manage your user details.
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">Username</label>
            <Controller
              name="Username"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="JohnDoe"
                  />
                  <p className="text-xs mt-1">
                    This is Username. Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.Username && (<ErrorMessage error={errors.Username.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Password</label>
            <Controller
              name="Password"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="password"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="*******"
                  />
                  <p className="text-xs mt-1">
                    This is password. Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.Password && (<ErrorMessage error={errors.Password.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Name</label>
            <Controller
              name="Name"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="John Doe"
                  />
                  <p className="text-xs mt-1">
                    This is Name. Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.Name && (<ErrorMessage error={errors.Name.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Email</label>
            <Controller
              name="Email"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="email"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="johndoe@mail.com"
                  />
                  <p className="text-xs mt-1">
                    This is Email.
                  </p>
                  {errors.Email && (<ErrorMessage error={errors.Email.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Address</label>
            <Controller
              name="Address"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="Bekasi, West Java, Indonesia"
                  />
                  <p className="text-xs mt-1">
                    This is Address. Required.
                  </p>
                  {errors.Address && (<ErrorMessage error={errors.Address.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Phone</label>
            <Controller
              name="Phone"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="081234567891"
                  />
                  <p className="text-xs mt-1">
                    This is Phone. Number Only. Required.
                  </p>
                  {errors.Phone && (<ErrorMessage error={errors.Phone.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Role ID</label>
            <Controller
              name="RoleID"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="Role ID"
                  />
                  <p className="text-xs mt-1">
                    This is Role ID. Number Only. Required.
                  </p>
                  {errors.RoleID && (<ErrorMessage error={errors.RoleID.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Theme App</label>
            <Controller
              name="AppthemeID"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="App Theme ID"
                  />
                  <p className="text-xs mt-1">
                    This is Theme App. Number Only. Required.
                  </p>
                  {errors.AppthemeID && (<ErrorMessage error={errors.AppThemeID.message} />)}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 w-5/6">
            <div>
              <Controller
                name="IsSuperAdmin"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="checkbox"
                      checked={field.value}
                      className="mr-2 text-blue-500"
                    />
                    <span className="text-sm sm:text-base">Super Admin</span>
                  </>
                )}
              />
            </div>
            <div>
              <Controller
                name="IsActive"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="checkbox"
                      checked={field.value}
                      className="mr-2 text-blue-500"
                    />
                    <span className="text-sm sm:text-base">Active</span>
                  </>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white"
          >
            Update User
          </Button>
        </form>

      </div>
    </section>
  );
}

export default UserDetails;
