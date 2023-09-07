'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import AddCategory from './AddCategory';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';

function CatTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [catNames, setCatNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategoryID, setDeletingCategoryID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });

  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`listcategory?page=${currentPage}&num=${itemsPerPage}`);
      const jsonData = response.body.Data;
      const pageInfo = response.body.Info;
      setData(jsonData);
      setError(null);
      setPageInfo(pageInfo);
    } catch (error) {
      setError(error.message);
    }
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
    for (const category of data) {
      if (!catNamesMap[category.CategoryParentID]) {
        catNamesMap[category.CategoryParentID] = await fetchCatName(category.CategoryParentID);
      }
    }
    setCatNames(catNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await KmsAPI('DELETE', 'category', { CategoryID: deletingCategoryID });

      const updatedData = data.filter(
        (category) => category.CategoryID !== deletingCategoryID,
      );
      setData(updatedData);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingCategoryID(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCategoryID(null);
  };

  useEffect(() => {
    fetchData();
  }, [router.pathname, itemsPerPage, currentPage]);

  useEffect(() => {
    if (data.length > 0) {
      updateCatNames();
    }
  }, [data]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const truncateText = (text, length) => {
    if (text.length > length) {
      return `${text.slice(0, length - 3)}...`;
    }
    return text;
  };

  const handleNavigate = (CategoryID) => {
    // Programmatically navigate to a different route
    router.push(`/documents/category/${CategoryID}`);
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      {/* buat s.admin */}
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">category Table</h2>
          <div className="my-2">
            <AddCategory fetchData={fetchData} />
            <ItmsPerPageComp
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Parent Name</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((category) => (
                <tr key={category.CategoryID}>
                  <td className="px-4 py-2">{category.CategoryID}</td>
                  <td className="px-4 py-2">{category.CategoryName}</td>
                  <td className="px-4 py-2 text-center">
                    {' '}
                    {catNames[category.CategoryParentID] === category.CategoryName ? '-' : catNames[category.CategoryParentID] || category.CategoryParentID}
                  </td>
                  <td className="px-4 py-2 flex justify-end items-center">
                    <button
                      onClick={() => handleNavigate(category.CategoryID)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setDeletingCategoryID(category.CategoryID);
                        setDeleteMessage(
                          `Are you sure you would like to delete "${category.CategoryName}" category? This action cannot be undone.`,
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
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleConfirmDelete}
          message={deleteMessage}
        />
      </div>
      {/* buat user biasa */}

      {/* <div className="h-full mt-14">
          <div className="fixed w-full ml-1">
            <h1 className="text-white text-2xl font-bold mb-4">Dashboard</h1>
          </div>
          <div className="container fixed mt-11 max-h-full w-5/6 md:w-3/4 overflow-y-auto overscroll-none bg-green-500">
            <div className="rounded-lg bg-yellow-500 mb-48 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">2</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">3</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">4</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">5</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">5</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">6</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">7</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">8</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">9</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">557 42</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">10</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div className="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div className="text-right">
                    <p className="text-2xl">END</p>
                    <p>End</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
    </section>
  );
}

export default CatTable;
