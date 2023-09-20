import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function ThemeApp({
  themeOptions,
  selectedTheme,
  handleThemeSelection,
  selectedThemeColors,
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Theme App</label>
      <div className="relative inline-block mb-2 w-full md:max-w-xs">
        <button
          type="button"
          onClick={toggleDropdown}
          className=" w-full border bg-white px-2 py-1 text-left rounded"
        >
          {themeOptions.length > 0
            && themeOptions.find((theme) => theme.AppthemeID === selectedTheme)?.AppthemeName
            || 'Select a theme'}
        </button>
        {isDropdownOpen && (
          <ul className="absolute top-full left-0 w-full z-20 bg-white border rounded shadow mt-2 max-h-40 overflow-y-auto">
            {themeOptions.map((theme) => (
              <li
                key={theme.AppthemeID}
                onClick={() => {
                  handleThemeSelection(theme);
                  setDropdownOpen(false); // Close the dropdown on selection
                }}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex items-center"
              >
                {theme.AppthemeName}
              </li>
            ))}
          </ul>
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className={`h-4 w-4 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6">
        <div className="mb-4">
          <label className="block font-normal mb-1">Primary</label>
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
        <div className="mb-4">
          <label className="block font-normal mb-1">Secondary</label>
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
      </div>
    </div>
  );
}

export default ThemeApp;
