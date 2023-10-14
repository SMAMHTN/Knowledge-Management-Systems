/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import AsyncSelect from 'react-select/async';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';

function CategorySelector({ onChange, defaultValue }) {
  const loadCategories = (inputValue) => {
    const UrlInputValue = encodeURIComponent(JSON.stringify([{
      field: 'CategoryName',
      operator: 'LowerLIKE',
      logic: 'AND',
      values: [`%${inputValue}%`],
    }]));

    return KmsAPIGET(`listcategory?num=20&query=${UrlInputValue}`)
      .then((dataAPI) => dataAPI.body.Data.map((item) => ({ value: item.CategoryID, label: item.CategoryName })))
      .catch((error) => {
        console.error('Error fetching categories:', error);
        throw error;
      });
  };
  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadCategories}
      onChange={onChange}
      defaultValue={defaultValue}
    />
  );
}

export default CategorySelector;
