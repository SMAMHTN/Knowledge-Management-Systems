import React, { useState, useRef } from 'react';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import {
  useOutsideClick, useModal, alertAdd, EmptyWarning,
} from '@/components/Feature';
import { RequiredFieldIndicator, FieldNumOnly } from '@/components/FormComponent';

function AddPermission({ fetchData }) {
  const { isModalOpen, openModal, closeModal } = useModal();
  const ref = useRef(null);
  const [formData, setFormData] = useState({
    CategoryID: '',
    RoleID: '',
    Create: 0,
    Read: 0,
    Update: 0,
    Delete: 0,
    FileType: '',
    DocType: '',
  });
  useOutsideClick(ref, closeModal);
  const [roleIDIsValid, setRoleIDIsValid] = useState(true);
  const [categoryIDIsValid, setcategoryIDIsValid] = useState(true);

  const validateAndSetValidity = (fieldName, value) => {
    let isValid;

    if (value.trim() === '') {
      isValid = true;
    } else if (!isNaN(value)) {
      isValid = true;
    } else {
      isValid = false;
    }

    switch (fieldName) {
      case 'RoleID':
        setRoleIDIsValid(isValid);
        break;
      case 'CategoryID':
        setcategoryIDIsValid(isValid);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const {
      name, value, type, checked,
    } = e.target;
    let parsedValue;

    if (type === 'checkbox') {
      parsedValue = checked ? 1 : 0;
    } else if (
      name === 'CategoryID'
      || name === 'RoleID'
    ) {
      validateAndSetValidity(name, value);
      if (value.trim() === '') {
        parsedValue = '';
      } else {
        parsedValue = !isNaN(value) ? parseInt(value, 10) : value;
      }
    } else {
      parsedValue = value === '' ? '' : value;
    }
    console.log(`name: ${name}, value: ${value}, parsedValue: ${parsedValue}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleCancel = () => {
    setFormData({
      CategoryID: '',
      RoleID: '',
      Create: 0,
      Read: 0,
      Update: 0,
      Delete: 0,
      FileType: '',
      DocType: '',
    });
    closeModal();
  };
  function splitStringToArray(inputString) {
    if (typeof inputString === 'string') {
      return inputString
        .split(',')
        .map((item) => item.trim().replace(/\s+/g, ''))
        .filter((item) => item !== '');
    }

    return [];
  }

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.CategoryID || !formData.RoleID) {
      EmptyWarning({
        type: 'error',
        message: 'Required fields cannot be empty',
      });
      return;
    }

    formData.DocType = splitStringToArray(formData.DocType);
    formData.FileType = splitStringToArray(formData.FileType);

    console.log(formData);
    try {
      console.log(formData);
      const response = await KmsAPI('POST', 'permission', formData);

      alertAdd(response);

      fetchData();
    } catch (error) {
      console.log('Error occurred:', error);
      // Handle error, show a message, etc.
    }

    closeModal();
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New +
      </button>

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
        <div className="bg-white rounded-lg p-6 shadow-md relative z-40 w-[66vh]" ref={ref}>
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-semibold mb-4">Add Permission</h2>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                CategoryID
                {' '}
                <RequiredFieldIndicator />
              </label>
              <input
                type="text"
                name="CategoryID"
                value={formData.CategoryID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
              {!categoryIDIsValid && (
              <FieldNumOnly />
              )}
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">
                RoleID
                {' '}
                <RequiredFieldIndicator />
              </label>
              <input
                type="text"
                name="RoleID"
                value={formData.RoleID}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
              {!roleIDIsValid && (
                <FieldNumOnly />
              )}
            </div>

            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  name="Create"
                  checked={formData.Create === 1}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Create
              </label>
            </div>
            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  name="Read"
                  checked={formData.Read === 1}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Read
              </label>
            </div>
            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  name="Update"
                  checked={formData.Update === 1}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Update
              </label>
            </div>
            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  name="Delete"
                  checked={formData.Delete === 1}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Delete
              </label>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">FileType</label>
              <input
                type="text"
                name="FileType"
                value={formData.FileType}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">DocType</label>
              <input
                type="text"
                name="DocType"
                value={formData.DocType}
                onChange={handleInputChange}
                className="border px-2 py-1 w-full"
              />
            </div>
            <div className="place-content-end mt-10 flex">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPermission;
