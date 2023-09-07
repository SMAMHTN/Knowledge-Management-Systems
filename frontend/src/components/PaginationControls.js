import React, { useState } from 'react';

export function ItmsPerPageComp({ itemsPerPage, setCurrentPage, setItemsPerPage }) {
  const options = [5, 20, 100, 500];

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className="my-2">
      <span className="mr-2">Items per page:</span>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => {
            handleItemsPerPageChange(option);
          }}
          className={`ml-2 px-4 py-2 rounded ${
            itemsPerPage === option
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-black'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function PaginationComp({
  currentPage, totalRow, totalPages, handlePageChange, upperLimit, lowerLimit,
}) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-4 flex justify-center items-center">
      <button
        onClick={() => {
          if (!isFirstPage) {
            handlePageChange(currentPage - 1);
          }
        }}
        className={`px-4 py-2 rounded ${isFirstPage ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}
        disabled={isFirstPage}
      >
        Prev
      </button>
      <span className="ml-2">
        Data show
        {' '}
        {lowerLimit}
        -
        {upperLimit}
        {' '}
        of
        {' '}
        {totalRow}
      </span>
      <button
        onClick={() => {
          if (!isLastPage) {
            handlePageChange(currentPage + 1);
          }
        }}
        className={`ml-2 px-4 py-2 rounded ${isLastPage ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}
        disabled={isLastPage}
      >
        Next
      </button>
    </div>
  );
}
