/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import dynamic from 'next/dynamic'
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
