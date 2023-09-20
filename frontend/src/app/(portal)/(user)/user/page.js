'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CoreAPIGET, CoreAPI } from '@/dep/core/coreHandler';
import AddUser from './AddUser';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';
import { Separator } from '@/components/ui/separator';

function UserTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUserID, setDeletingUserID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET(`listuser?page=${currentPage}&num=${itemsPerPage}`);
      const jsonData = response.body.Data;
      const pageInfo = response.body.Info;
      setData(jsonData);
      setPageInfo(pageInfo);
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
    for (const user of data) {
      if (!roleNamesMap[user.RoleID]) {
        roleNamesMap[user.RoleID] = await fetchRoleName(user.RoleID);
      }
    }
    setRoleNames(roleNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await CoreAPI('DELETE', 'user', { UserID: deletingUserID });

      const updatedData = data.filter(
        (user) => user.UserID !== deletingUserID,
      );
      setData(updatedData);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingUserID(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUserID(null);
  };

  useEffect(() => {
    fetchData();
  }, [router.pathname, itemsPerPage, currentPage]);

  useEffect(() => {
    if (data.length > 0) {
      updateRoleNames();
    }
  }, [data]);

  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.slice(0, length - 3)}...`;
    }
    return text;
  };

  const handleNavigate = (userID) => {
    // Programmatically navigate to a different route
    router.push(`/user/${userID}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">List User</h2>
        <p className="text-xs mb-4">
          view and access list of user profiles.
        </p>
        <Separator className="mb-4" />
        <div className="my-2">
          <AddUser fetchData={fetchData} />
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">UserID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Roles</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((user) => (
                <tr key={user.UserID}>
                  <td className="px-4 py-2">{user.UserID}</td>
                  <td className="px-4 py-2">{user.Username}</td>
                  <td className="px-4 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {truncateText(user.Name, 15)}
                  </td>
                  <td className="text-center">
                    {user.IsActive === 1 ? 'Active' : 'Not Active'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {' '}
                    {roleNames[user.RoleID] || '-'}
                  </td>
                  <td className="px-4 py-2">
                    {truncateText(user.Email, 20)}
                  </td>
                  <td className="px-4 py-2 flex justify-end items-center">
                    <button
                      onClick={() => handleNavigate(user.UserID)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setDeletingUserID(user.UserID);
                        setDeleteMessage(
                          `Are you sure you would like to delete user "${user.Username}"? This action cannot be undone.`,
                        );
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-500 text-white rounded px-2 py-1 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="7">Loading data...</td>
                </tr>
            )}
          </tbody>
        </table>

        <PaginationComp
          currentPage={currentPage}
          totalPages={pageInfo.TotalPage}
          totalRow={pageInfo.TotalRow}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          upperLimit={pageInfo.UpperLimit}
          lowerLimit={pageInfo.LowerLimit}
        />
        <ItmsPerPageComp
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleConfirmDelete}
          message={deleteMessage}
        />
      </div>
    </section>
  );
}

export default UserTable;
