'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CoreAPI, CoreAPIGET, getUserData } from '@/dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import LogoUpload from '@/app/(portal)/settings/LogoUpload';
import ProfileImage from '@/components/Navbar/ShowUserPhoto';
import { Separator } from '@/components/SmComponent';
import { Input } from '@/components/ui/input';

function UserSettings() {
  const [data, setData] = useState({});
  const [initialSettings, setInitialSettings] = useState([]);
  const [themeOptions, setThemeOptions] = useState([]);
  const editableFields = ['Username', 'Password', 'Name', 'Email', 'Address', 'Phone', 'RoleID'];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setData(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await CoreAPIGET('listtheme');
        const themeData = response.body.Data;
        setThemeOptions(themeData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchThemes();
  }, []);

  // Create a mapping of AppthemeID to AppthemeName
  const appthemeMapping = {};
  themeOptions.forEach((theme) => {
    appthemeMapping[theme.AppthemeID] = theme.AppthemeName;
  });

  // Function to get AppthemeName based on AppthemeID
  const getAppthemeName = (appthemeID) => appthemeMapping[appthemeID] || '';
  const handleAppthemeIDChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      AppthemeID: newValue,
    }));
  };
  useEffect(() => {
    // Create initial settings array when data changes
    const initialSettingsArray = editableFields.map((field) => ({
      field,
      value: data[field], // Use the corresponding property value from the user data
    }));
    setInitialSettings(initialSettingsArray);
  }, [data]);

  const [editing, setEditing] = useState(null);

  const handleEditClick = (index) => {
    setEditing(index);
  };

  const handleCancelClick = () => {
    setEditing(null);
  };

  const handleSaveClick = async () => {
    try {
      const updatedData = await CoreAPI('PUT', 'user', data);
      alertUpdate(updatedData);
    } catch (error) {
      console.log(error);
      console.log('Error occurred while saving changes.');
    }
    setEditing(null);
  };

  const handleInputChange = (field, newValue) => {
    setData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const handleLogoUpload = (base64String) => {
    // Update the data state with the uploaded logo
    setData({ ...data, UserPhoto: base64String });
  };
  return (
    <section className="h-screen flex flex-auto w-full">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-2">Profile settings</h2>
        <p className="text-xs mb-4">
          Customize and manage your profile details.
        </p>
        <Separator className="mb-4" />
        {/* Small Viewport Table (Without Left Column) */}
        <table className="w-full block sm:hidden ">
          <tbody>
            {initialSettings.map((setting, index) => (
              <tr key={index} className="border-y border-black">
                <td className="p-2 w-2/4">
                  {/* Middle column */}
                  {editing === index ? (
                    <Input
                      type="text"
                      value={data[setting.field]}
                      onChange={(e) => handleInputChange(setting.field, e.target.value)}
                      className="border rounded px-2 py-1 w-full bg-white"
                    />
                  ) : (
                    setting.value
                  )}
                </td>
                <td className="p-2">
                  {editing === index ? (
                    <div className="flex items-center space-x-2">
                      <button onClick={handleCancelClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-1 py-1 rounded">
                        <X />
                      </button>
                      <button
                        onClick={handleSaveClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        save
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(index)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="border-y border-black">
              <td className="p-2">
                {editing === 'apptheme' ? (
                  // Dropdown for editing AppthemeID
                  <select
                    value={data.AppthemeID}
                    onChange={(e) => handleAppthemeIDChange(Number(e.target.value))}
                    className="border px-2 py-1 w-full"
                  >
                    {themeOptions.map((theme) => (
                      <option key={theme.AppthemeID} value={theme.AppthemeID}>
                        {theme.AppthemeName}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Display the AppthemeName based on the AppthemeID
                  getAppthemeName(data.AppthemeID)
                )}
              </td>
              <td className="p-2">
                {editing === 'apptheme' ? (
                  <div className="flex items-center space-x-2">
                    <button onClick={handleCancelClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-1 py-1 rounded">
                      <X />
                    </button>
                    <button
                      onClick={handleSaveClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing('apptheme')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td className="p-2">
                <ProfileImage maxWidth="50px" maxHeight="50px" />
              </td>
            </tr>
            <tr>
              <td className="p-2"><LogoUpload onUpload={handleLogoUpload} /></td>
            </tr>
            <tr>
              <td className="p-2">
                <button
                  onClick={handleSaveClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  save
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Medium and Larger Viewport Table (With Full Information) */}
        <table className="w-full hidden sm:table">
          <tbody>
            {initialSettings.map((setting, index) => (
              <tr key={index} className="border-y border-black">
                <td className="p-2 w-2/4">
                  {/* The left column */}
                  {setting.field}
                </td>
                {/* Middle column */}
                <td className="p-2 w-2/4">
                  {editing === index ? (
                    <Input
                      type="text"
                      value={data[setting.field]}
                      onChange={(e) => handleInputChange(setting.field, e.target.value)}
                      className="border rounded px-2 py-1 w-full bg-white"
                    />
                  ) : (
                    setting.value
                  )}
                </td>
                <td className="p-2">
                  {editing === index ? (
                    <div className="flex items-center space-x-2 items-end ">
                      <button onClick={handleCancelClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded">
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        save
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEditClick(index)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr className="border-y border-black">
              <td className="p-2">
                <div>
                  Theme:
                </div>
              </td>
              <td className="p-2">
                {editing === 'apptheme' ? (
                  // Dropdown for editing AppthemeID
                  <select
                    value={data.AppthemeID}
                    onChange={(e) => handleAppthemeIDChange(Number(e.target.value))}
                    className="border px-2 py-1 w-full"
                  >
                    {themeOptions.map((theme) => (
                      <option key={theme.AppthemeID} value={theme.AppthemeID}>
                        {theme.AppthemeName}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Display the AppthemeName based on the AppthemeID
                  getAppthemeName(data.AppthemeID)
                )}
              </td>
              <td className="p-2">
                {editing === 'apptheme' ? (
                  <div className="flex items-center space-x-2">
                    <button onClick={handleCancelClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded">
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing('apptheme')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                )}
              </td>
            </tr>
            <tr>
              <td className="p-2">
                <ProfileImage maxWidth="50px" maxHeight="50px" />
              </td>
              <td className="p-2"><LogoUpload onUpload={handleLogoUpload} /></td>
              <td className="p-2">
                <button
                  onClick={handleSaveClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  save
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserSettings;
