"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KmsAPIGET, KmsAPI } from "@/dep/kms/kmsHandler";
import AddPermission from "./AddPermission";

function PerTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await KmsAPIGET("listpermission");
      const jsonData = response.body.Data;
      setData(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (PermissionID) => {
    try {
      // Send the delete request to the server
      await KmsAPI("DELETE", "permission", { PermissionID });

      const updatedData = data.filter(
        (permission) => permission.PermissionID !== PermissionID
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router.pathname]);

  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.slice(0, length - 3) + "...";
    }
    return text;
  };

  const handleNavigate = (PermissionID) => {
    // Programmatically navigate to a different route
    router.push(`/documents/permission/${PermissionID}`);
  };

  return (
    <>
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
                  <th className="px-4 py-2">PermissionID</th>
                  <th className="px-4 py-2">CategoryID</th>
                  <th className="px-4 py-2">RoleID</th>
                  <th className="px-4 py-2">Create</th>
                  <th className="px-4 py-2">Read</th>
                  <th className="px-4 py-2">Update</th>
                  <th className="px-4 py-2">Delete</th>
                  <th className="px-4 py-2">FileType</th>
                  <th className="px-4 py-2">DocType</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((permission) => (
                  <tr key={permission.PermissionID}>
                    <td className="px-4 py-2">{permission.PermissionID}</td>
                    <td className="px-4 py-2">{permission.CategoryID}</td>
                    <td className="px-4 py-2">{permission.RoleID}</td>
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
                        onClick={() => handleDelete(permission.PermissionID)}
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
    </>
  );
}

export default PerTable;
