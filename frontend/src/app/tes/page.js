'use client';

import React, { useState } from 'react';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import RoleSelector from '@/components/select/RoleSelector';
import UserSelector from '@/components/select/UserSelector';
import CategorySelector from '@/components/select/CategorySelector';
import getThemeCookiesValue from '@/dep/core/getThemeCookiesValue';

function tes() {
  const themeValue = getThemeCookiesValue();
  console.log(themeValue);
  // const [selectedRole, setSelectedRole] = useState({
  //   value: 0,
  //   label: 'test',
  // });
  // const [selectedUser, setSelectedUser] = useState({
  //   value: 0,
  //   label: 'test',
  // });
  // const [selectedCategory, setSelectedCategory] = useState({
  //   value: 0,
  //   label: 'test',
  // });
  // const handleRoleChange = (selectedOption) => {
  //   setSelectedRole(selectedOption);
  // };
  // const handleUserChange = (selectedOption) => {
  //   setSelectedUser(selectedOption);
  // };
  // const handleCategoryChange = (selectedOption) => {
  //   setSelectedCategory(selectedOption);
  // };
  return (
    // <>
    //   <ArticleEditor />
    //   <RoleSelector onChange={handleRoleChange} />
    //   <p>{selectedRole.value}</p>
    //   <p>{selectedRole.label}</p>
    //   <UserSelector onChange={handleUserChange} />
    //   <p>{selectedUser.value}</p>
    //   <p>{selectedUser.label}</p>
    //   <CategorySelector onChange={handleCategoryChange} />
    //   <p>{selectedCategory.value}</p>
    //   <p>{selectedCategory.label}</p>
    // </>
  );
}

export default tes;
