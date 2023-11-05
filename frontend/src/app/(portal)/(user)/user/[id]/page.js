'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { CoreAPI, CoreAPIGET } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import { userSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/select/RoleSelector';
import ThemeSelector from '@/components/select/ThemeSelector';

function UserDetails({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      UserID: '',
      Username: '',
      Password: '',
      Name: '',
      Email: '',
      Address: '',
      Phone: '',
      Note: '',
      IsSuperAdmin: false,
      IsActive: false,
    },
    resolver: yupResolver(userSchema),
  });

  const [selectedRole, setSelectedRole] = useState({
    value: 1,
    label: 'Everyone',
  });
  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };
  const [selectedTheme, setSelectedTheme] = useState({
    value: 1,
    label: 'Default Theme',
  });
  const handleThemeChange = (selectedOption) => {
    setSelectedTheme(selectedOption);
  };

  const fetchUserData = async () => {
    try {
      const response = await CoreAPIGET(`user?UserID=${params.id}`);
      const { Data } = response.body;
      console.log(response);
      Object.keys(Data).forEach((key) => {
        setValue(key, Data[key]);
      });
      setSelectedRole({
        value: response.body.Data.RoleID,
        label: response.body.Data.RoleName,
      });
      setSelectedTheme({
        value: response.body.Data.AppthemeID,
        label: response.body.Data.AppthemeName,
      });
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
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
      const updatedData = {
        UserID: formData.UserID,
        Username: formData.Username,
        Password: formData.Password,
        Name: formData.Name,
        Email: formData.Email,
        Address: formData.Address,
        Phone: formData.Phone,
        RoleID: selectedRole.value,
        AppthemeID: selectedTheme.value,
        Note: formData.Note,
        IsSuperAdmin: formData.IsSuperAdmin,
        IsActive: formData.IsActive,
      };

      const response = await CoreAPI('PUT', 'user', updatedData);
      await new Promise((resolve) => setTimeout(resolve, 300));

      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-fit flex flex-auto w-full">
      <div className="flex flex-col w-full">
        <div className="bg-white w-full rounded-md shadow px-4 py-2 mb-2">
          <h2 className="text-2xl font-semibold mb-1">Edit User</h2>
          <p className="text-xs mb-1">
            view and access list of user.
          </p>
          <Separator />
        </div>
        <div className="bg-white rounded-md shadow p-4">
          <div className="md:w-4/5 lg:w-3/4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Username
                  <RequiredFieldIndicator />
                </label>
                <Controller
                  name="Username"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md shadow"
                        placeholder="JohnDoe"
                      />
                      <p className="text-xs mt-1">
                        Min 2 characters & Max 50 characters. Required.
                      </p>
                      {errors.Username && (<ErrorMessage error={errors.Username.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Password
                  {' '}
                  <RequiredFieldIndicator />
                </label>
                <Controller
                  name="Password"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="password"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md shadow"
                        placeholder="*******"
                      />
                      <p className="text-xs mt-1">
                        Min 8 characters & Max 50 characters. Required.
                      </p>
                      {errors.Password && (<ErrorMessage error={errors.Password.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Name
                  <RequiredFieldIndicator />
                </label>
                <Controller
                  name="Name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md shadow"
                        placeholder="John Doe"
                      />
                      <p className="text-xs mt-1">
                        Min 2 characters & Max 50 characters. Required.
                      </p>
                      {errors.Name && (<ErrorMessage error={errors.Name.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Email
                  <RequiredFieldIndicator />
                </label>
                <Controller
                  name="Email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="email"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md shadow"
                        placeholder="johndoe@mail.com"
                      />
                      {errors.Email && (<ErrorMessage error={errors.Email.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Address</label>
                <Controller
                  name="Address"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md shadow"
                        placeholder="Bekasi, West Java, Indonesia"
                      />
                      {errors.Address && (<ErrorMessage error={errors.Address.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Phone</label>
                <Controller
                  name="Phone"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md shadow"
                        placeholder="081234567891"
                      />
                      <p className="text-xs mt-1">
                        Phone Number. Number Only.
                      </p>
                      {errors.Phone && (<ErrorMessage error={errors.Phone.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Role
                  <RequiredFieldIndicator />
                </label>
                <RoleSelector onChange={handleRoleChange} value={selectedRole} />
                <p className="text-xs mt-1">
                  Select Role. Required.
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Theme App</label>
                <ThemeSelector onChange={handleThemeChange} value={selectedTheme} />
                <p className="text-xs mt-1">
                  Select Theme. Required.
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Note</label>
                <Controller
                  name="Note"
                  control={control}
                  render={({ field }) => (
                    <>
                      <textarea
                        {...field}
                        type="textarea"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md shadow"
                        placeholder="John Doe is a farmer, he likes grass as his breakfast"
                      />
                      <p className="text-xs mt-1">
                        Give a brief explanation of the the user.
                      </p>
                      {errors.Note && (<ErrorMessage error={errors.Note.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-5/6 mb-4">
                <div>
                  <Controller
                    name="IsSuperAdmin"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4 shadow"
                        />
                        <span className="text-sm sm:text-base">Super Admin</span>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="IsActive"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center my-2 md:my-0 ">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4 shadow"
                        />
                        <span className="text-sm sm:text-base">Active</span>
                      </div>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-500 hover:bg-blue-600 text-white w-full md:w-36 mb-4 shadow"
              >
                Update User
              </Button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

export default UserDetails;
