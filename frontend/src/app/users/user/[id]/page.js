'use client';

import { useState, useEffect } from 'react';
import { CoreAPI, CoreAPIGET } from '../../../../dep/core/coreHandler';

function UserDetails({ params }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await CoreAPIGET(`user?UserID=${params.id}`);
        console.log(response);

        setData(response.body.Data);
      } catch (error) {
        // Handle errors here
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [params.id]);

  const handleUpdate = async () => {
    try {
      console.log('heran');

      console.log(data);
      console.log(params.id);
      await CoreAPI('PUT', 'user', data);
    } catch (error) {
      console.log(error);
      console.log('Ada error anjg');
      // Handle error
    }
  };

  return (
    <section className="max-w-screen-xl h-screen flex flex-col flex-auto">
      <div className="max-w-md ml-14 p-4 mt-9">
        <div className="max-w-3xl mx-auto p-4">
          <form action={handleUpdate}>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Username</label>
              <input
                type="text"
                value={data.Username || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Username: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="text"
                value={data.Password || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Password: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                value={data.Name || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="text"
                value={data.Email || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Address</label>
              <input
                type="text"
                value={data.Address || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Address: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                value={data.Phone || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, Phone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Role id</label>
              <input
                type="text"
                value={data.RoleID || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, RoleID: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Theme App</label>
              <input
                type="text"
                value={data.AppThemeID || ''}
                className="border px-2 py-1 w-full"
                onChange={(e) => setData({ ...data, AppThemeID: parseInt(e.target.value, 10) })}
              />
            </div>
            <div>
              <label className="font-medium">Note</label>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                rows="4"
                value={data.Note || ''}
                onChange={(e) => setData({ ...data, Note: e.target.value })}
              />
            </div>

            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={data.IsSuperAdmin === 1 || 0} // Check if IsActive is 1
                  onChange={() => setData({ ...data, IsSuperAdmin: data.IsSuperAdmin === 1 ? 0 : 1 })} // Toggle between 1 and 0
                />
                Is Super Admin
              </label>
            </div>

            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={data.IsActive === 1 || 0} // Check if IsActive is 1
                  onChange={() => setData({ ...data, IsActive: data.IsActive === 1 ? 0 : 1 })} // Toggle between 1 and 0
                />
                Is Active
              </label>
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
