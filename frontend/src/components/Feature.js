'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from './ui/button';

export const useOutsideClick = (ref, closeModal) => {
  useEffect(() => {
    const handleEvent = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal();
      }
    };

    window.addEventListener('mousedown', handleEvent);

    return () => {
      window.removeEventListener('mousedown', handleEvent);
    };
  }, [ref, closeModal]);
};

export function useModal(initialState = false) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return { isModalOpen, openModal, closeModal };
}

const success = (successText) => toast.success(successText, {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
});

const error = (errorText) => toast.error(errorText, {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
});

export const formatConsoleMessage = (statusCode, data) => `Status Code: ${statusCode}, Data: ${data}`;

// alert for add new data
export const alertAdd = (response) => {
  const statusMessages = {
    200: 'Data has been successfully added!',
    403: 'You do not have permission to access this resource',
    409: 'Duplicate entry found. Please use a different value.',
  };

  const statusCode = response.body.StatusCode;
  const consoleMessage = formatConsoleMessage(statusCode, response.body.Data);

  if (statusMessages[statusCode]) {
    // Display an appropriate error or success message
    if (statusCode === 200) {
      success(statusMessages[statusCode]);
      // Refresh the page after successfully saving the data
    } else {
      error(statusMessages[statusCode]);
      console.log(consoleMessage);
    }
  } else {
    // Display a generic error message for other status codes
    error('An error occurred while saving data. Please try again.');
    console.log(consoleMessage);
  }
};

// alert for delete data
export const alertDelete = (response) => {
  const statusMessages = {
    200: 'Data has been successfully deleted!',
    403: 'You do not have permission to access this resource',
  };

  const statusCode = response.body.StatusCode;
  const consoleMessage = formatConsoleMessage(statusCode, response.body.Data);

  if (statusMessages[statusCode]) {
    // Display an appropriate error or success message
    if (statusCode === 200) {
      success(statusMessages[statusCode]);
      // Refresh the page after successfully saving the data
    } else {
      error(statusMessages[statusCode]);
      console.log(consoleMessage);
    }
  } else {
    // Display a generic error message for other status codes
    error('An error occurred while saving data. Please try again.');
    console.log(consoleMessage);
  }
};

// alert for update data
export const alertUpdate = (response) => {
  const statusMessages = {
    200: 'Data has been successfully updated!',
    403: 'You do not have permission to access this resource',
    409: 'Duplicate entry found. Please use a different value.',
  };

  const statusCode = response.body.StatusCode;
  const consoleMessage = formatConsoleMessage(statusCode, response.body.Data);

  if (statusMessages[statusCode]) {
    // Display an appropriate error or success message
    if (statusCode === 200) {
      success(statusMessages[statusCode]);
      // Refresh the page after successfully saving the data
    } else {
      error(statusMessages[statusCode]);
      console.log(consoleMessage);
    }
  } else {
    // Display a generic error message for other status codes
    error('An error occurred while saving data. Please try again.');
    console.log(consoleMessage);
  }
};

// delete confirmation popup
export function DeleteModal({
  isOpen, onClose, onDelete, message,
}) {
  const modalRef = useRef(null);

  // Attach the useOutsideClick hook to the modal's background
  useOutsideClick(modalRef, onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded p-6 shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">{message}</p>
        {/* <div className="flex justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2 w-full md:w-36"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full md:w-36"
            onClick={onDelete}
          >
            Delete
          </button>
        </div> */}
        <div className="place-content-end mt-10 flex">
          <Button
            type="button"
            className="bg-gray-500 hover:bg-gray-400 border border-gray-200 text-white px-4 py-2 rounded mr-2 w-full md:w-36"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onDelete}
            className="rounded bg-red-500 hover:bg-red-600 text-white w-full md:w-36"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
