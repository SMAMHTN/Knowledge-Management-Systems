'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KmsAPIGET, KmsAPI } from '@/dep/kms/kmsHandler';
import AddArticle from './AddArticle';
import { DeleteModal, alertDelete } from '@/components/Feature';
import { CoreAPIGET } from '@/dep/core/coreHandler';
import { ItmsPerPageComp, PaginationComp } from '@/components/PaginationControls';

function DocTable(handleItemsPerPageChange) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [usNames, setUsNames] = useState({});
  const [catNames, setCatNames] = useState({});
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingArticleID, setDeletingArticleID] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pageInfo, setPageInfo] = useState({ TotalPage: 0 });

  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`listarticle?page=${currentPage}&num=${itemsPerPage}`);
      const jsonData = response.body.Data;
      const pageInfo = response.body.Info;
      setData(jsonData);
      setPageInfo(pageInfo);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUsName = async (OwnerID) => {
    try {
      const responseUs = await CoreAPIGET(`user?UserID=${OwnerID}`);
      return responseUs.body.Data.Name;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return null;
    }
  };

  const updateUsNames = async () => {
    const usNamesMap = {};
    for (const article of data) {
      if (!usNamesMap[article.OwnerID]) {
        usNamesMap[article.OwnerID] = await fetchUsName(article.OwnerID);
      }
    }
    setUsNames(usNamesMap);
  };

  const fetchRoleName = async (categoryID) => {
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
    for (const article of data) {
      if (!catNamesMap[article.CategoryID]) {
        catNamesMap[article.CategoryID] = await fetchRoleName(article.CategoryID);
      }
    }
    setCatNames(catNamesMap);
  };

  const handleConfirmDelete = async () => {
    try {
      const responseDel = await KmsAPI('DELETE', 'article', { ArticleID: deletingArticleID });

      const updatedData = data.filter(
        (article) => article.ArticleID !== deletingArticleID,
      );
      setData(updatedData);
      alertDelete(responseDel);
      setIsDeleteModalOpen(false);
      setDeletingArticleID(null);
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
      updateUsNames();
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

  const handleNavigate = (ArticleID) => {
    // Programmatically navigate to a different route
    router.push(`/documents/article/${ArticleID}`);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      {/* buat s.admin */}
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Doc Table</h2>
          <div className="my-2"><AddArticle fetchData={fetchData} /></div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Last Edited</th>
                <th className="px-4 py-2">Tag</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Article</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((article) => (
                <tr key={article.ArticleID}>
                  <td className="px-4 py-2">{article.ArticleID}</td>
                  <td className="px-4 py-2 text-center">
                    {' '}
                    {usNames[article.OwnerID] || '-'}
                  </td>
                  <td className="px-4 py-2">{article.LastEditedTime}</td>
                  <td className="px-4 py-2">{article.Tag}</td>
                  <td className="px-4 py-2">{article.Title}</td>
                  <td className="px-4 py-2 text-center">
                    {' '}
                    {catNames[article.CategoryID] || '-'}
                  </td>
                  <td className="px-4 py-2">{article.Article}</td>
                  <td className="px-4 py-2">{article.IsActive}</td>
                  {/* <td className="px-4 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {truncateText(article.DocType, 15)}
                    </td>
                    <td className="px-4 py-2">
                      {truncateText(article.DocLoc, 20)}
                    </td> */}
                  <td className="px-4 py-2 flex justify-end items-center">
                    <button
                      onClick={() => handleNavigate(article.ArticleID)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setDeletingArticleID(article.ArticleID);
                        setDeleteMessage(
                          `Are you sure you would like to delete "${article.Title}" Article? This action cannot be undone.`,
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

export default DocTable;
