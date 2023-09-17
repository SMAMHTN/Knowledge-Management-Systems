// HamburgerButton.js
import React from 'react';
import { hamburgerIcon } from '@/constants/icon';

function HamburgerButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="ml-3 text-black hover:text-gray-300">
      {hamburgerIcon}
    </button>
  );
}

export default HamburgerButton;
