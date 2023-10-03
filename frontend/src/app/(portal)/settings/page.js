'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { settingsSchema } from '@/constants/schema';
import { CoreAPI, CoreAPIGET } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import ThemeApp from '@/components/AppThemeDropdown';
import AddTheme from './AddTheme';
import LogoUpload from './LogoUpload';
import TimezoneDropdown from '@/components/TimezoneDropdown';
import { Separator, ErrorMessage, RequiredFieldIndicator } from '@/components/SmComponent';

import { Button } from '@/components/ui/button';

function SystemSetting() {
  const router = useRouter();
  const {
    control, setValue, handleSubmit, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CompanyName: '',
      CompanyAddress: '',
    },
    resolver: yupResolver(settingsSchema),
  });
  const [themeOptions, setThemeOptions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedThemeColors, setSelectedThemeColors] = useState({
    primary: '',
    secondary: '',
  });

  const [initialTimezone, setInitialTimezone] = useState('');
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET('setting');
      const jsonData = response.body.Data;
      setData(jsonData);
      const { Data } = response.body;
      setInitialTimezone(jsonData.TimeZone);
      Object.keys(Data).forEach((key) => {
        setValue(key, Data[key]);
      });
    } catch (error) {
      console.error(error);
      console.error('An error occurred');
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await CoreAPIGET('listtheme');
      const themeData = response.body.Data;
      setThemeOptions(themeData);
    } catch (error) {
      console.error(error);
      console.error('An error occurred');
    }
  };

  useEffect(() => {
    fetchData();
    fetchThemes();
  }, [router.pathname]);

  useEffect(() => {
    // Set the initial theme after fetching data
    if (themeOptions.length > 0 && data.AppthemeID !== undefined) {
      const initialTheme = themeOptions.find(
        (theme) => theme.AppthemeID === data.AppthemeID,
      );
      if (initialTheme) {
        setSelectedTheme(initialTheme.AppthemeID);
        const colors = JSON.parse(initialTheme.AppthemeValue);

        // Parse the primary and secondary colors from the colors object
        const { primary_color, secondary_color } = colors;

        setSelectedThemeColors({
          primary: primary_color || '',
          secondary: secondary_color || '',
        });
      } else {
        setSelectedTheme(0);
        setSelectedThemeColors({
          primary: '',
          secondary: '',
        });
      }
    }
  }, [data.AppthemeID, themeOptions]);

  const handleTimezoneChange = (timezone) => {
    setData((prevData) => ({
      ...prevData,
      TimeZone: timezone,
    }));
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme.AppthemeID);

    const colors = JSON.parse(theme.AppthemeValue);
    setSelectedThemeColors({
      primary: colors.primary_color || '',
      secondary: colors.secondary_color || '',
    });
  };

  const onSubmit = async (data) => {
    try {
      const { error } = settingsSchema.validate(data);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const selectedThemeId = parseInt(selectedTheme);

      const updatedData = {
        CompanyName: data.CompanyName,
        CompanyLogo: data.CompanyLogo,
        CompanyAddress: data.CompanyAddress,
        TimeZone: data.TimeZone,
        AppthemeID: selectedThemeId,
      };
      const response = await CoreAPI('PUT', 'setting', updatedData);
      if (response.status === 200) {
        fetchData();
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log('Error:', error);
      console.log('An error occurred during update.');
      console.error('Error updating data:', error);
    }
  };

  const handleLogoUpload = (base64String) => {
    console.log('Handling logo upload in SystemSetting:', base64String);
    setData({ ...data, CompanyLogo: base64String });
  };

  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">System Settings</h2>
        <p className="text-xs mb-4">
          Customize and manage your Company Profile and system settings.
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Company Name
              <RequiredFieldIndicator />
            </label>
            <Controller
              name="CompanyName"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    {...field}
                    className=" text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="Company Name Inc."
                  />
                  <p className="text-xs mt-1">
                    Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.CompanyName && (<ErrorMessage error={errors.CompanyName.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Company Address
              <RequiredFieldIndicator />
            </label>
            <Controller
              name="CompanyAddress"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="text"
                    {...field}
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="Bandung, West Java, Indonesia"
                  />
                  <p className="text-xs mt-1">
                    Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.CompanyAddress && (<ErrorMessage error={errors.CompanyAddress.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Logo</label>
            <LogoUpload onUpload={handleLogoUpload} />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Timezone</label>
            <TimezoneDropdown
              selectedTimezone={data.TimeZone || initialTimezone}
              onTimezoneChange={handleTimezoneChange}
            />
            <p className="text-xs mt-1">
              Choose your preferred timezone from the list above.
            </p>
          </div>
          <ThemeApp
            themeOptions={themeOptions}
            selectedTheme={selectedTheme}
            handleThemeSelection={handleThemeSelection}
            selectedThemeColors={selectedThemeColors}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white w-full md:w-36"
          >
            Update Settings
          </Button>
        </form>
        <div className="mb-4" />
        <AddTheme fetchThemes={fetchThemes} />
      </div>
    </section>
  );
}

export default SystemSetting;
