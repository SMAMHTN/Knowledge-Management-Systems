import React from 'react';
import AsyncSelect from 'react-select/async';
import { CoreAPIGET } from '@/dep/core/coreHandler';

function ThemeSelector({ onChange, value }) {
  const loadTheme = (inputValue) => {
    const UrlInputValue = encodeURIComponent(JSON.stringify([{
      field: 'AppthemeName',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${inputValue}%`],
    }]));

    return CoreAPIGET(`listtheme?num=20&query=${UrlInputValue}`)
      .then((dataAPI) => dataAPI.body.Data.map((item) => ({ value: item.AppthemeID, label: item.AppthemeName })))
      .catch((error) => {
        console.error('Error fetching roles:', error);
        throw error;
      });
  };
  return (
    <AsyncSelect
      className="md:max-w-md shadow"
      cacheOptions
      defaultOptions
      loadOptions={loadTheme}
      onChange={onChange}
      value={value}
    />
  );
}

export default ThemeSelector;
