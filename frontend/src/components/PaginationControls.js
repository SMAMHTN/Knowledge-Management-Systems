// import React from 'react';

// export function ItmsPerPageComp({ itemsPerPage, setCurrentPage, setItemsPerPage }) {
//   const options = [5, 20, 100, 500];

//   const handleItemsPerPageChange = (newItemsPerPage) => {
//     setCurrentPage(1);
//     setItemsPerPage(newItemsPerPage);
//   };

//   return (
//     <div className="my-2">
//       <span className="mr-2">Items per page:</span>
//       {options.map((option) => (
//         <button
//           key={option}
//           onClick={() => {
//             handleItemsPerPageChange(option);
//           }}
//           className={`ml-2 px-4 py-2 rounded ${
//             itemsPerPage === option
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-300 text-black'
//           }`}
//         >
//           {option}
//         </button>
//       ))}
//     </div>
//   );
// }

// export function PaginationComp({
//   currentPage, totalRow, totalPages, handlePageChange, upperLimit, lowerLimit,
// }) {
//   const isFirstPage = currentPage === 1;
//   const isLastPage = currentPage === totalPages;

//   return (
//     <div className="mt-4 flex justify-center items-center">
//       <button
//         onClick={() => {
//           if (!isFirstPage) {
//             handlePageChange(currentPage - 1);
//           }
//         }}
//         className={`px-4 py-2 rounded ${isFirstPage ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}
//         disabled={isFirstPage}
//       >
//         Prev
//       </button>
//       <span className="ml-2">
//         Data show
//         {' '}
//         {lowerLimit}
//         -
//         {upperLimit}
//         {' '}
//         of
//         {' '}
//         {totalRow}
//       </span>
//       <button
//         onClick={() => {
//           if (!isLastPage) {
//             handlePageChange(currentPage + 1);
//           }
//         }}
//         className={`ml-2 px-4 py-2 rounded ${isLastPage ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}
//         disabled={isLastPage}
//       >
//         Next
//       </button>
//     </div>
//   );
// }
// PaginationControls.js

import { useRouter } from 'next/navigation';

function PaginationControls({
  hasNextPage,
  hasPrevPage,
  page,
  per_page,
  router,
}) {
  const goToPage = (newPage) => {
    router.push(`/?page=${newPage}&per_page=${per_page}`);
  };

  return (
    <div className="flex gap-2">
      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasPrevPage}
        onClick={() => goToPage(Number(page) - 1)}
      >
        prev page
      </button>

      <div>
        {page}
        {' '}
        /
        {' '}
        {Math.ceil(10 / Number(per_page))}
      </div>

      <button
        className="bg-blue-500 text-white p-1"
        disabled={!hasNextPage}
        onClick={() => goToPage(Number(page) + 1)}
      >
        next page
      </button>
    </div>
  );
}

export default PaginationControls;
