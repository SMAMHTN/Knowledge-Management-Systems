import React from 'react';
import AsyncSelect from 'react-select/async';
import { CoreAPIGET } from '@/dep/core/coreHandler';

function RoleSelector({ onChange, value }) {
  const loadRoles = (inputValue) => {
    const UrlInputValue = encodeURIComponent(JSON.stringify([{
      field: 'RoleName',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${inputValue}%`],
    }]));

    return CoreAPIGET(`listrole?num=20&query=${UrlInputValue}`)
      .then((dataAPI) => dataAPI.body.Data.map((item) => ({ value: item.RoleID, label: item.RoleName })))
      .catch((error) => {
        console.error('Error fetching roles:', error);
        throw error;
      });
  };
  return (
    <AsyncSelect
      className="md:max-w-md shadow"
      id="RoleSelector"
      cacheOptions
      defaultOptions
      loadOptions={loadRoles}
      onChange={onChange}
      value={value}
    />
  );
}

export default RoleSelector;
