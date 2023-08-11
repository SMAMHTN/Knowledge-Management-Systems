'use client'
import React from "react";
import { useState, useEffect } from "react";
import { CoreAPI, CoreAPIGET } from "../../dep/core/coreHandler";

function SystemSetting() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET("setting");
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
  }, []);

  const handleUpdate = async () => {
    try {
      console.log("heran");

      console.log(data);
      data.AppThemeID = parseInt(data.AppThemeID);
      const response = await CoreAPI("PUT", "setting", data);
    } catch (error) {
      console.log(error);
      console.log("Ada error anjg");
      // Handle error
    }
  };

  return (
    <>
          <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <form action={handleUpdate}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">CompanyName</label>
              <input
                type="text"
                value={data.CompanyName || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, CompanyName: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">CompanyLogo</label>
              <input
                type="text"
                value={data.CompanyLogo || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, CompanyLogo: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">CompanyAddress</label>
              <input
                type="text"
                value={data.CompanyAddress || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, CompanyAddress: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">TimeZone</label>
              <input
                type="text"
                value={data.TimeZone || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, TimeZone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Theme App</label>
              <input
                type="text"
                value={data.AppthemeID || ""}
                className="border px-2 py-1 w-full"
                onChange={(e) =>
                  setData({ ...data, AppthemeID: e.target.value })
                }
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
    </>
  );
}

export default SystemSetting;
