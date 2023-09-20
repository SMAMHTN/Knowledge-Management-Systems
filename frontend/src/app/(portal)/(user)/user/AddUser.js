import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { userSchema } from '@/constants/schema';
import { RequiredFieldIndicator, ErrorMessage } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOutsideClick, useModal, alertAdd } from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddUser({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
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
  useOutsideClick(ref, closeModal);

  const handleClose = () => {
    reset();
    closeModal();
  };

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      const { error } = userSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const response = await KmsAPI('POST', 'user', formData);
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
    <div className="">
      <Button
        type="button"
        onClick={openModal}
        className="rounded bg-blue-500 text-white w-full md:w-36"
      >
        Add New +
      </Button>

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
            {closeIcon}
          </button>
          <h2 className="text-2xl font-semibold mb-2">Add User</h2>
          <Separator className="mb-4" />
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
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
                Role ID
                <RequiredFieldIndicator />
              </label>
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
                      Input a valid Role ID. Number Only. Required.
                    </p>
                    {errors.RoleID && (<ErrorMessage error={errors.RoleID.message} />)}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                App Theme ID
                <RequiredFieldIndicator />
              </label>
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
                      Input a valid Theme App. Number Only. Required.
                    </p>
                    {errors.AppthemeID && (<ErrorMessage error={errors.AppthemeID.message} />)}
                  </>
                )}
              />
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
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
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
                        className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4"
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
                    <div className="flex items-center my-2 md:my-0">
                      <input
                        {...field}
                        type="checkbox"
                        checked={field.value}
                        className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4"
                      />
                      <span className="text-sm sm:text-base">Active</span>
                    </div>
                  )}
                />
              </div>
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
                Add User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
