import React, { useState } from 'react';

export function CalcPagiData(data, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  return {
    totalPages,
    startIndex,
    endIndex,
    currentPageData,
  };
}

export function ItmsPerPageComp({ itemsPerPage, setItemsPerPage }) {
  const options = [20, 100, 500];
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };
  return (
    <div className="my-2">
      <span className="mr-2">Items per page:</span>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleItemsPerPageChange(option)}
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

export function PagiCtrl({
  currentPage, totalPages, onPageChange, onItemsPerPageChange,
}) {
  const nextPage = () => {
    onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    onPageChange(currentPage - 1);
  };

  const goToPage = (page) => {
    onPageChange(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    onItemsPerPageChange(newItemsPerPage);
    onPageChange(1);
  };

  const visiblePages = 5;
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const middlePage = Math.floor(visiblePages / 2);
      let startPage = Math.max(currentPage - middlePage, 1);
      const endPage = Math.min(startPage + visiblePages - 1, totalPages);

      if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(endPage - visiblePages + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }

      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="mr-2 px-4 py-2 bg-gray-300 rounded"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 px-4 py-2 bg-gray-300 rounded"
      >
        Prev
      </button>
      {pageNumbers.map((pageNumber, index) => (
        <React.Fragment key={index}>
          {pageNumber === '...' ? (
            <span className="mx-1 px-3 py-2">...</span>
          ) : (
            <button
              onClick={() => onPageChange(pageNumber)}
              className={`mx-1 px-3 py-2 rounded ${
                currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {pageNumber}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2 px-4 py-2 bg-gray-300 rounded"
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="ml-2 px-4 py-2 bg-gray-300 rounded"
      >
        Last
      </button>
    </div>
  );
}

export function usePagination(data, initialItemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage); // Rename this function

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentPageData = data.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const updateItemsPerPage = (newItemsPerPage) => { // Change the function name here
    setCurrentPage(1);
    setItemsPerPage(newItemsPerPage);
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentPageData,
    nextPage,
    prevPage,
    goToPage,
    updateItemsPerPage,
  };
}
