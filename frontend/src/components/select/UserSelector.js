/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import AsyncSelect from 'react-select/async';
import { CoreAPIGET } from '@/dep/core/coreHandler';

function UserSelector({ onChange, value }) {
  const loadUsers = (inputValue) => {
    const UrlInputValue = encodeURIComponent(JSON.stringify([{
      field: 'Name',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${inputValue}%`],
    }, {
      field: 'Username',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${inputValue}%`],
    }]));

    return CoreAPIGET(`listuser?num=20&query=${UrlInputValue}`)
      .then((dataAPI) => dataAPI.body.Data.map((item) => ({ value: item.UserID, label: `${item.Name} (${item.Username})` })))
      .catch((error) => {
        console.error('Error fetching user:', error);
        throw error;
      });
  };
  return (
    <AsyncSelect
      className="md:max-w-md"
      cacheOptions
      defaultOptions
      loadOptions={loadUsers}
      onChange={onChange}
      value={value}
    />
  );
}

export default UserSelector;
