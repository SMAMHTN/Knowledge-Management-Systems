import React, { useState, useRef } from 'react';
import timezones from 'timezones-list';

function TimezoneDropdown({ selectedTimezone, onTimezoneChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown button

  const handleTimezoneSelection = (timezone) => {
    onTimezoneChange(timezone);
  };
  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event propagation

    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutsideDropdown = (event) => {
    if (dropdownOpen && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Attach and detach event listeners when the dropdown is opened/closed
  React.useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutsideDropdown);
    } else {
      document.removeEventListener('click', handleClickOutsideDropdown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, [dropdownOpen]);

  return (
    <div className="mt-4">
      <div className="relative inline-block w-full max-w-xs" ref={dropdownRef}>
        <button
          className="bg-white border rounded px-3 py-2 w-full text-left"
          onClick={(e) => toggleDropdown(e)}
        >
          {selectedTimezone || 'Select a timezone'}
        </button>
        {dropdownOpen && (
          <ul className="absolute top-full left-0 w-full z-20 bg-white border rounded shadow mt-2 max-h-40 overflow-y-auto">
            {timezones.map((timezone, index) => (
              <li
                key={index}
                onClick={() => handleTimezoneSelection(timezone.tzCode)}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
              >
                {timezone.label}
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
  );
}

export default TimezoneDropdown;
