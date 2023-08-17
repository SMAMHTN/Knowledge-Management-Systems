import { useEffect, useState } from 'react';

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
