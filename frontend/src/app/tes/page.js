'use client';

import React, { useState } from 'react';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import RoleSelector from '@/components/select/RoleSelector';
import UserSelector from '@/components/select/UserSelector';
import CategorySelector from '@/components/select/CategorySelector';

function tes() {
  const [selectedRole, setSelectedRole] = useState({
    value: 1,
    label: 'Everyone',
  });
  const [selectedUser, setSelectedUser] = useState({
    value: 1,
    label: 'Admin',
  });
  const [selectedCategory, setSelectedCategory] = useState({
    value: 1,
    label: 'Parent',
  });
  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };
  return (
    <>
      <ArticleEditor />
      <RoleSelector onChange={handleRoleChange} defaultValue={selectedRole} />
      <p>{selectedRole.value}</p>
      <p>{selectedRole.label}</p>
      <UserSelector onChange={handleUserChange} defaultValue={selectedUser} />
      <p>{selectedUser.value}</p>
      <p>{selectedUser.label}</p>
      <CategorySelector onChange={handleCategoryChange} defaultValue={selectedCategory} />
      <p>{selectedCategory.value}</p>
      <p>{selectedCategory.label}</p>
    </>
  );
}

export default tes;
