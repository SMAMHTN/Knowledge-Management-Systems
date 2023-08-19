'use client';

import React, { useState, useEffect } from 'react';
import { CoreAPI, getUserData } from '../../../dep/core/coreHandler';
import { alertUpdate } from '@/components/Feature';
import ShowLogo from '@/components/ShowLogo';
import LogoUpload from '@/app/settings/LogoUpload';
import ProfileImage from '@/components/ShowUserPhoto';

function UserSettings() {
  const [data, setData] = useState({});
  const [initialSettings, setInitialSettings] = useState([]);
  const editableFields = ['Username', 'Password', 'Name', 'Email', 'Address', 'Phone', 'RoleID', 'AppthemeID'];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setData(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
    console.log(data);
  };
  return (
    <section className="max-w-screen-xl h-screen relative mt-9">
      <div className="mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">User Settings</h2>

        {/* Small Viewport Table (Without Left Column) */}
        <table className="w-full block sm:hidden">
          <tbody>
            {initialSettings.map((setting, index) => (
              <tr key={index} className="border-y border-black">
                <td className="p-2 w-1/4">
                  {/* Middle column */}
                  {editing === index ? (
                    <input
                      type="text"
                      value={data[setting.field]}
                      onChange={(e) => handleInputChange(setting.field, e.target.value)}
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    setting.value
                  )}
                </td>
                <td className="p-2">
                  {editing === index ? (
                    <div className="flex items-center space-x-2">
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
          </tbody>
        </table>

        {/* Medium and Larger Viewport Table (With Full Information) */}
        <table className="w-full hidden sm:table">
          <tbody>
            {initialSettings.map((setting, index) => (
              <tr key={index} className="border-y border-black">
                <td className="p-2 w-1/4">
                  {/* The left column */}
                  {setting.field}
                </td>
                {/* Middle column */}
                <td className="p-2 w-1/4">
                  {editing === index ? (
                    <input
                      type="text"
                      value={data[setting.field]}
                      onChange={(e) => handleInputChange(setting.field, e.target.value)}
                      className="border px-2 py-1 w-full"
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
          </tbody>
        </table>
        <div className="mb-4 text-black">
          <ProfileImage maxWidth="100px" maxHeight="100px" />
        </div>

        <LogoUpload onUpload={handleLogoUpload} />
        <button
          onClick={handleSaveClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
        >
          save
        </button>
      </div>
    </section>
  );
}

export default UserSettings;
