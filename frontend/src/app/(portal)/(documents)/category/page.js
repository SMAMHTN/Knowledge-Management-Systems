'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import AddCategory from './AddCategory';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';
import { Separator } from '@/components/ui/separator';

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
    router.push(`/category/${CategoryID}`);
  };

  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">List Category</h2>
        <p className="text-xs mb-4">
          view and access list of categories.
        </p>
        <Separator className="mb-4" />
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
    </section>
  );
}

export default CatTable;
