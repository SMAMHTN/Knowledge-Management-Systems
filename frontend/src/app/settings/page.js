'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { CoreAPI, CoreAPIGET } from '../../dep/core/coreHandler';
import AddTheme from './AddTheme';
import ShowLogo from '../../components/ShowLogo';
import LogoUpload from './LogoUpload';

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

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET('setting');
      const jsonData = response.body.Data;
      setData(jsonData);
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

      // Add this console.log to check themeOptions
      console.log('Theme Options:', themeData);
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

  // useEffect for logging selected theme colors
  useEffect(() => {
    // Log the selected theme colors whenever it changes
    console.log('Selected Theme Colors:', selectedThemeColors);
  }, [selectedThemeColors]);

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
        TimeZone: data.TimeZone,
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

  // Close the dropdown when a click occurs outside of the dropdown area
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

  // Toggle the dropdown when the button is clicked
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  // Handle theme selection from the dropdown
  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme.AppthemeID);

    // Parse the primary and secondary colors from the selected theme
    const colors = JSON.parse(theme.AppthemeValue);
    setSelectedThemeColors({
      primary: colors.primary_color || '',
      secondary: colors.secondary_color || '',
    });
  };
  // Define a callback function to handle the uploaded data
  const handleLogoUpload = (base64String) => {
    // Update the data state with the uploaded logo
    setData({ ...data, CompanyLogo: base64String });
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleUpdate}>
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
              <label className="block font-semibold mb-1">TimeZone</label>
              <input
                type="text"
                value={data.TimeZone || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, TimeZone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Theme App</label>
              <div className="relative inline-block" style={{ minWidth: '200px' }}>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="border px-2 py-1 w-full text-left"
                >
                  {themeOptions.length > 0
                      && themeOptions.find((theme) => theme.AppthemeID === selectedTheme)?.AppthemeName}
                </button>
                {isDropdownOpen && (
                <ul className="theme-dropdown absolute mt-1 bg-white border rounded">
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
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </form>
          <AddTheme fetchThemes={fetchThemes} />
        </div>
      </div>
    </section>
  );
}

export default SystemSetting;
