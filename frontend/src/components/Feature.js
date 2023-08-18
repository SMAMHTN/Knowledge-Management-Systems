import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return { isModalOpen, openModal, closeModal };
}

export const success = (successText) => toast.success(successText, {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
});

export const error = (errorText) => toast.error(errorText, {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
});

const formatConsoleMessage = (statusCode, data) => `Status Code: ${statusCode}, Data: ${data}`;

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
