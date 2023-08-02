export default function Settings() {
    return (
      <>
        <section class="max-w-screen-xl h-screen">
          <div class="h-full mx-auto mt-5 mb-1">
            <div className="w-full ml-1">
            <h1 className="text-white text-2xl font-bold mb-4">Settings</h1>
            </div>
            <div className="container mt-3 w-full rounded-lg bg-green-500">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
                <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div class="text-right">
                    <p class="text-2xl">1,257</p>
                    <p>mngmnt KMS</p>
                  </div>
                </div>
                <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div class="text-right">
                    <p class="text-2xl">557</p>
                    <p>mngmnnt s admin</p>
                  </div>
                </div>
                <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div class="text-right">
                    <p class="text-2xl">$11,257</p>
                    <p>Sales</p>
                  </div>
                </div>
                <div class="bg-blue-500 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
                  <div class="text-right">
                    <p class="text-2xl">$75,257</p>
                    <p>Balances</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }