import React, { useState, useRef } from 'react';
import timezones from 'timezones-list';
import { ChevronDown } from 'lucide-react';

function TimezoneDropdown({ selectedTimezone, onTimezoneChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleTimezoneSelection = (timezone) => {
    onTimezoneChange(timezone);
  };
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutsideDropdown = (event) => {
    if (dropdownOpen && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

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
    <div className="">
      <div className="relative inline-block w-full md:max-w-xs" ref={dropdownRef}>
        <button
          className="bg-white border rounded px-2 py-1 w-full text-left"
          onClick={(e) => toggleDropdown(e)}
        >
          {selectedTimezone || 'Select a timezone'}
        </button>
        {dropdownOpen && (
          <ul className="absolute top-full left-0 w-full z-20 bg-white border rounded shadow mt-2 max-h-40 lg:max-h-80 overflow-y-auto">
            {timezones.map((timezone, index) => (
              <li
                key={index}
                onClick={() => {
                  handleTimezoneSelection(timezone.tzCode);
                  setDropdownOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100"
              >
                {timezone.label}
              </li>
            ))}
          </ul>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className={`h-4 w-4 transition-transform transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'} ease-in-out duration-200`} />
        </div>
      </div>
    </div>
  );
}

export default TimezoneDropdown;
