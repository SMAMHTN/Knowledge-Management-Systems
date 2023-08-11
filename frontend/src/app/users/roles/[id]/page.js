"use client";

import { useState, useEffect } from "react";
import { CoreAPI, CoreAPIGET } from "../../../../dep/core/coreHandler";

function UserDetails({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET("role?RoleID=" + params.id);
        console.log(response);
        const jsonData = response.body.Data;

        setData(jsonData);
        console.log(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [params.id]);

  const handleUpdate = async () => {
    try {
      console.log("heran");

      console.log(data);
      console.log(params.id);
      data.RoleParentID = parseInt(data.RoleParentID);
      const response = await CoreAPI("PUT", "role", data);
    } catch (error) {
      console.log(error);
      console.log("Ada error anjg");
      // Handle error
    }
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <form action={handleUpdate}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Role ID</label>
              <input
                type="text"
                value={data.RoleID || ""}
                className="border px-2 py-1 w-full"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Role Name</label>
              <input
                type="text"
                value={data.RoleName || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, RoleName: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Role Parent ID</label>
              <input
                type="text"
                value={data.RoleParentID || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, RoleParentID: e.target.value })}
              />
            </div>
            <div>
              <label className="font-medium">Description</label>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                rows="4"
                value={data.RoleDescription || ""}
                onChange={(e) => setData({ ...data, RoleDescription: e.target.value })}
              />
            </div>

           
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UserDetails;
