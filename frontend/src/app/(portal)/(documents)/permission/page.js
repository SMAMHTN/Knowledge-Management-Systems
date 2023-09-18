'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KmsAPIGET, KmsAPI } from '@/dep/kms/kmsHandler';
import { CoreAPIGET } from '@/dep/core/coreHandler';
import AddPermission from './AddPermission';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';

function PermTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [roleNames, setRoleNames] = useState({});
  const [catNames, setCatNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPermissionID, setDeletingPermissionID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });

  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`listpermission?page=${currentPage}&num=${itemsPerPage}`);
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
    for (const permission of data) {
      if (!roleNamesMap[permission.RoleID]) {
        roleNamesMap[permission.RoleID] = await fetchRoleName(permission.RoleID);
      }
    }
    setRoleNames(roleNamesMap);
  };

  const fetchCatName = async (categoryID) => {
    try {
      const responseCat = await KmsAPIGET(`category?CategoryID=${categoryID}`);
      return responseCat.body.Data.CategoryName;
    } catch (error) {
      console.error('Error fetching category name:', error);
      return null;
    }
  };

  const updateCatNames = async () => {
    const catNamesMap = {};
    for (const permission of data) {
      if (!catNamesMap[permission.CategoryID]) {
        catNamesMap[permission.CategoryID] = await fetchCatName(permission.CategoryID);
      }
    }
    setCatNames(catNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await KmsAPI('DELETE', 'permission', { PermissionID: deletingPermissionID });

      const updatedData = data.filter(
        (permission) => permission.PermissionID !== deletingPermissionID,
      );
      setData(updatedData);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingPermissionID(null);
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPermissionID(null);
  };

  useEffect(() => {
    fetchData();
  }, [router.pathname, itemsPerPage, currentPage]);

  useEffect(() => {
    if (data.length > 0) {
      updateRoleNames();
    }
  }, [data]);
  useEffect(() => {
    if (data.length > 0) {
      updateCatNames();
    }
  }, [data]);

  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.slice(0, length - 3)}...`;
    }
    return text;
  };

  const handleNavigate = (PermissionID) => {
    // Programmatically navigate to a different route
    router.push(`/permission/${PermissionID}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      {/* buat s.admin */}
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">permission Table</h2>
          <div className="my-2">
            <AddPermission fetchData={fetchData} />
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">C</th>
                <th className="px-4 py-2">R</th>
                <th className="px-4 py-2">U</th>
                <th className="px-4 py-2">D</th>
                <th className="px-4 py-2">FileType</th>
                <th className="px-4 py-2">DocType</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((permission) => (
                <tr key={permission.PermissionID}>
                  <td className="px-4 py-2">{permission.PermissionID}</td>
                  <td className="px-4 py-2">{catNames[permission.CategoryID] || '-'}</td>
                  <td className="px-4 py-2">{roleNames[permission.RoleID] || '-'}</td>
                  <td className="px-4 py-2">{permission.Create}</td>
                  <td className="px-4 py-2">{permission.Read}</td>
                  <td className="px-4 py-2">{permission.Update}</td>
                  <td className="px-4 py-2">{permission.Delete}</td>
                  <td className="px-4 py-2">{permission.FileType}</td>
                  <td className="px-4 py-2">{permission.DocType}</td>
                  <td className="px-4 py-2 flex justify-end items-center">
                    <button
                      onClick={() => handleNavigate(permission.PermissionID)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setDeletingPermissionID(permission.PermissionID);
                        setDeleteMessage(
                          `Are you sure you would like to delete permission id "${permission.PermissionID}" ? This action cannot be undone.`,
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

export default PermTable;
