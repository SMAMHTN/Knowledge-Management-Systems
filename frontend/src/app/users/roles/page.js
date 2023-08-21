'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoreAPIGET, CoreAPI } from '../../../dep/core/coreHandler';
import AddRole from './AddRole';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { CalcPagiData, PagiCtrl, ItmsPerPageComp } from '@/components/PaginationControls';

function RoleTable(handleItemsPerPageChange) {
  const router = useRouter();
  const [listRoles, setListRoles] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRoleID, setDeletingRoleID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    totalPages,
    startIndex,
    endIndex,
    currentPageData,
  } = CalcPagiData(listRoles, currentPage, itemsPerPage);

  const fetchListRoles = async () => {
    try {
      const response = await CoreAPIGET('listrole');
      const jsonData = response.body.Data;
      setListRoles(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchRoleName = async (roleID) => {
    try {
      const responseRole = await CoreAPIGET(`role?RoleID=${roleID}`);
      return responseRole.body.Data.RoleName;
    } catch (error) {
      console.error('Error fetching role name:', error);
      return null;
    }
  };

  const updateRoleNames = async () => {
    const roleNamesMap = {};
    for (const role of listRoles) {
      if (!roleNamesMap[role.RoleParentID]) {
        roleNamesMap[role.RoleParentID] = await fetchRoleName(role.RoleParentID);
      }
    }
    setRoleNames(roleNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await CoreAPI('DELETE', 'role', { RoleID: deletingRoleID });

      const updatedListRoles = listRoles.filter(
        (role) => role.RoleID !== deletingRoleID,
      );
      setListRoles(updatedListRoles);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingRoleID(null);
    } catch (error) {
      console.error('Error deleting Role:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingRoleID(null);
  };

  useEffect(() => {
    fetchListRoles();
  }, [router.pathname]);

  useEffect(() => {
    if (listRoles.length > 0) {
      updateRoleNames();
    }
  }, [listRoles]);

  const handleNavigate = (RoleID) => {
    router.push(`/users/roles/${RoleID}`);
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Roles Table</h2>
          <div className="my-2">
            <AddRole fetchData={fetchListRoles} />
          </div>
          <ItmsPerPageComp
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Role Name</th>
                <th className="px-4 py-2">Parent Name</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((role) => (
                <tr key={role.RoleID} className="border-b">
                  <td className="px-4 py-2">{role.RoleID}</td>
                  <td className="px-4 py-2">{role.RoleName}</td>
                  <td className="px-4 py-2 text-center">
                    {' '}
                    {roleNames[role.RoleParentID] === role.RoleName ? '-' : roleNames[role.RoleParentID] || role.RoleParentID}
                  </td>
                  <td className="px-4 py-2 flex justify-end items-center">
                    <button
                      onClick={() => handleNavigate(role.RoleID)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingRoleID(role.RoleID);
                        setDeleteMessage(
                          `Are you sure you would like to delete "${role.RoleName}" role? This action cannot be undone.`,
                        );
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PagiCtrl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
          message={deleteMessage}
        />
      </div>
    </section>
  );
}

export default RoleTable;
