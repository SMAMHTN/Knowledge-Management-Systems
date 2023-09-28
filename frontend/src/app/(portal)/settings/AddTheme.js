import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CoreAPI } from '@/dep/core/coreHandler';

import { themeSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useOutsideClick, useModal, alertAdd } from '@/components/Feature';
import { closeIcon } from '@/constants/icon';

function AddTheme({ fetchThemes }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const {
    handleSubmit, control, reset, formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(themeSchema),
    defaultValues: {
      AppthemeName: '',
    },
  });

  useOutsideClick(ref, closeModal);

  const handleClose = () => {
    reset();
    closeModal();
    setPrimaryColor('#000000');
    setSecondaryColor('#000000');
  };

  const handlePrimaryColorChange = (e) => {
    const rawColorValue = e.target.value;
    const formattedColorValue = rawColorValue.toUpperCase();
    setPrimaryColor(formattedColorValue);
  };

  const handleSecondaryColorChange = (e) => {
    const rawColorValue = e.target.value;
    const formattedColorValue = rawColorValue.toUpperCase();
    setSecondaryColor(formattedColorValue);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...data,
        AppthemeValue: JSON.stringify({
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        }),
      };

      const response = await CoreAPI('POST', 'theme', updatedFormData);

      fetchThemes();
      alertAdd(response);
      handleClose();
    } catch (error) {
      console.log('Error occurred:', error);
    }
  };
  return (
    <div>
      <Button
        type="button"
        onClick={openModal}
        className="rounded bg-blue-500 text-white w-full md:w-36"
      >
        Add Theme
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
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[50vh] mx-2" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={handleClose}
          >
            {closeIcon}
          </button>
          <h2 className="text-2xl font-semibold mb-2">Add Theme</h2>
          <Separator className="mb-4" />
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block font-medium mb-1">
                Theme Name
                <RequiredFieldIndicator />
              </label>
              <Controller
                name="AppthemeName"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="text"
                      {...field}
                      className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                      placeholder="Orange Juice orange theme"
                    />
                    <p className="text-xs mt-1">
                      Min 2 characters & Max 50 characters. Required.
                    </p>
                    {errors.AppthemeName && (<ErrorMessage error={errors.AppthemeName.message} />)}
                  </>
                )}
              />
            </div>
            <label className="block font-medium mb-1">Color</label>
            <p className="text-xs mt-1 mb-6">
              Choose primary and secondary color for your new theme.
            </p>
            <div className="grid grid-cols-2 gap-2">

              <div className="mb-4">
                <label className="block font-normal mb-1">Primary</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={handlePrimaryColorChange}
                />
              </div>
              <div className="mb-4">
                <label className="block font-normal mb-1">Secondary</label>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={handleSecondaryColorChange}
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
                Add Theme
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTheme;
