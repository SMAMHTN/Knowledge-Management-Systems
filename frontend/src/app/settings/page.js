'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { CoreAPI, CoreAPIGET } from '../../dep/core/coreHandler';
import AddTheme from './AddTheme';
import ShowLogo from '../../components/ShowLogo';
import LogoUpload from './LogoUpload';
import TimezoneDropdown from '@/components/TimezoneDropdown';

function SystemSetting() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [themeOptions, setThemeOptions] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(0); // Use 0 as default
  const [selectedThemeColors, setSelectedThemeColors] = useState({
    primary: '',
    secondary: '',
  });

  // Initialize the timezone with the data from the server
  const [initialTimezone, setInitialTimezone] = useState('');

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET('setting');
      const jsonData = response.body.Data;
      setData(jsonData);
      setInitialTimezone(jsonData.TimeZone); // Set the initial timezone from the server
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await CoreAPIGET('listtheme');
      const themeData = response.body.Data;
      setThemeOptions(themeData);
    } catch (error) {
      setError(error.message);
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
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log('Updating data:', data);

      // Convert selectedTheme to integer
      const selectedThemeId = parseInt(selectedTheme);

      const updatedData = {
        // Only include fields that need to be updated
        CompanyName: data.CompanyName,
        CompanyLogo: data.CompanyLogo,
        CompanyAddress: data.CompanyAddress,
        TimeZone: data.TimeZone, // Use the locally managed TimeZone
        AppthemeID: selectedThemeId, // Use the integer value
      };

      const response = await CoreAPI('PUT', 'setting', updatedData);
      console.log('Update response:', response);
      console.log('Updated theme:', selectedThemeId);

      // If the update is successful, fetch the data again
      if (response.status === 200) {
        fetchData(); // Call the fetchData function to fetch the updated data
      }
    } catch (error) {
      console.log('Error:', error);
      console.log('An error occurred during update.');
      console.error('Error updating data:', error);
    }
  };

  // Custom styled dropdown
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (isDropdownOpen && !event.target.closest('.theme-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme.AppthemeID);

    const colors = JSON.parse(theme.AppthemeValue);
    setSelectedThemeColors({
      primary: colors.primary_color || '',
      secondary: colors.secondary_color || '',
    });
  };

  const handleLogoUpload = (base64String) => {
    setData({ ...data, CompanyLogo: base64String });
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <form>
            <div className="mb-4">
              <label className="block font-semibold mb-1">CompanyName</label>
              <input
                type="text"
                value={data.CompanyName || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, CompanyName: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <ShowLogo maxWidth="100px" maxHeight="100px" />
            </div>
            <LogoUpload onUpload={handleLogoUpload} />
            {/* <div className="mb-4">
                <label className="block font-semibold mb-1">CompanyLogo</label>
                <input
                  type="text"
                  value={data.CompanyLogo || ""}
                  className="border px-2 py-1 w-full"
                  onChange={(e) =>
                    setData({ ...data, CompanyLogo: e.target.value })
                  }
                />
              </div> */}

            <div className="mb-4">
              <label className="block font-semibold mb-1">
                CompanyAddress
              </label>
              <input
                type="text"
                value={data.CompanyAddress || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, CompanyAddress: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Timezone</label>
              <TimezoneDropdown
                selectedTimezone={data.TimeZone || initialTimezone}
                onTimezoneChange={handleTimezoneChange}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Theme App</label>
              <div className="relative inline-block" style={{ minWidth: '200px' }}>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="border bg-white px-3 py-2 w-full text-left rounded"
                >

                  {themeOptions.length > 0
                      && themeOptions.find((theme) => theme.AppthemeID === selectedTheme)?.AppthemeName}
                </button>
                {isDropdownOpen && (
                <ul className="absolute top-full left-0 w-full z-20 bg-white border rounded shadow mt-2 max-h-40 overflow-y-auto">
                  {themeOptions.map((theme) => (
                    <li
                      key={theme.AppthemeID}
                      onClick={() => handleThemeSelection(theme)}
                      className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex items-center"
                    >
                      {/* Display primary and secondary color indicators */}
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: theme.primary_color }}
                      />
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: theme.secondary_color }}
                      />
                      {theme.AppthemeName}
                    </li>
                  ))}
                </ul>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Display the primary and secondary colors */}
            {selectedThemeColors.primary && (
            <div className="mb-2">
              <span>Primary Color: </span>
              <span
                style={{
                  backgroundColor: selectedThemeColors.primary,
                  width: '20px',
                  height: '20px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginLeft: '4px',
                }}
              />
            </div>
            )}
            {selectedThemeColors.secondary && (
            <div>
              <span>Secondary Color: </span>
              <span
                style={{
                  backgroundColor: selectedThemeColors.secondary,
                  width: '20px',
                  height: '20px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginLeft: '4px',
                }}
              />
            </div>
            )}

            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Update
            </button>
          </form>
          <AddTheme fetchThemes={fetchThemes} />
          <div className="mb-4" />
        </div>
      </div>
    </section>
  );
}

export default SystemSetting;
