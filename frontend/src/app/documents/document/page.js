'use client';

import React, { useState, useEffect } from 'react';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';

function DocTable() {
  const [datadoc, setDatadoc] = useState([]);
  const [datafile, setDatafile] = useState([]);
  const [docCategoryNames, setDocCategoryNames] = useState({});
  const [fileCategoryNames, setFileCategoryNames] = useState({});
  const [docCategoryNamesFetched, setDocCategoryNamesFetched] = useState(false);
  const [fileCategoryNamesFetched, setFileCategoryNamesFetched] = useState(false);

  const [error, setError] = useState('');

  const fetchDocData = async () => {
    try {
      const response = await KmsAPIGET('listdoc');
      const jsonData = response.body.Data;
      setDatadoc(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchFileData = async () => {
    try {
      const response = await KmsAPIGET('listfile');
      const jsonData = response.body.Data;
      setDatafile(jsonData);
      setError(null);
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

  useEffect(() => {
    const fetchCategoryNames = async () => {
      const docCatNames = {};
      const fileCatNames = {};
      for (const doc of datadoc) {
        if (!docCatNames[doc.CategoryID]) {
          docCatNames[doc.CategoryID] = await fetchCatName(doc.CategoryID);
        }
      }
      for (const file of datafile) {
        if (!fileCatNames[file.CategoryID]) {
          fileCatNames[file.CategoryID] = await fetchCatName(file.CategoryID);
        }
      }
      setDocCategoryNames(docCatNames);
      setFileCategoryNames(fileCatNames);
    };

    if (datadoc.length > 0 && datafile.length > 0) {
      fetchCategoryNames();
    }
  }, [datadoc, datafile]);

  const updateDocCatNames = async () => {
    const catNamesMap = {};
    for (const doc of datadoc) {
      if (!catNamesMap[doc.CategoryID]) {
        catNamesMap[doc.CategoryID] = await fetchCatName(doc.CategoryID);
      }
    }
    const updatedDocData = datadoc.map((doc) => ({
      ...doc,
      CategoryName: catNamesMap[doc.CategoryID] || doc.CategoryID,
    }));
    setDatadoc(updatedDocData);
    setDocCategoryNamesFetched(true);
  };

  const updateFileCatNames = async () => {
    const catNamesMap = {};
    for (const file of datafile) {
      if (!catNamesMap[file.CategoryID]) {
        catNamesMap[file.CategoryID] = await fetchCatName(file.CategoryID);
      }
    }
    const updatedFileData = datafile.map((file) => ({
      ...file,
      CategoryName: catNamesMap[file.CategoryID] || file.CategoryID,
    }));
    setDatafile(updatedFileData);
    setFileCategoryNamesFetched(true);
  };

  useEffect(() => {
    if (!docCategoryNamesFetched) {
      fetchDocData();
    }
  }, [docCategoryNamesFetched]);

  useEffect(() => {
    if (datadoc.length > 0 && !docCategoryNamesFetched) {
      updateDocCatNames();
    }
  }, [datadoc, docCategoryNamesFetched]);

  useEffect(() => {
    if (!fileCategoryNamesFetched) {
      fetchFileData();
    }
  }, [fileCategoryNamesFetched]);

  useEffect(() => {
    if (datafile.length > 0 && !fileCategoryNamesFetched) {
      updateFileCatNames();
    }
  }, [datafile, fileCategoryNamesFetched]);
  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      {/* buat s.admin */}
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Document Table</h2>
          <div className="my-2" />
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">DocID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {datadoc.map((document) => (
                <tr key={document.DocID}>
                  <td className="px-4 py-2">{document.DocID}</td>
                  <td className="px-4 py-2">{document.DocLoc.split('/').pop()}</td>
                  <td className="px-4 py-2">{docCategoryNames[document.CategoryID] || document.CategoryID}</td>
                  <td className="px-4 py-2">
                    {document.DocType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-w-3xl mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">File Table</h2>
          <div className="my-2" />
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">FileID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category  </th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {datafile.map((file) => (
                <tr key={file.FileID}>
                  <td className="px-4 py-2">{file.FileID}</td>
                  <td className="px-4 py-2">{file.FileLoc.split('/').pop() }</td>
                  <td className="px-4 py-2">{fileCategoryNames[file.CategoryID] || file.CategoryID}</td>
                  <td className="px-4 py-2">
                    {file.FileType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
