import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

function Pagination({ currentPage, totalPage, onPageChange }) {
  const correctedTotalPage = totalPage === 0 ? 1 : totalPage;

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPageClick = () => {
    onPageChange(1);
  };

  const handleLastPageClick = () => {
    onPageChange(totalPage);
  };
  return (
    <div className="flex">
      <div className="flex w-[100px] items-center mr-4 justify-center text-sm font-medium">
        Page
        {' '}
        {currentPage}
        {' '}
        of
        {' '}
        {correctedTotalPage}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex  bg-gray-50 shadow"
          disabled={currentPage === 1}
          onClick={handleFirstPageClick}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex  bg-gray-50 shadow"
          disabled={currentPage === 1}
          onClick={handlePrevClick}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex  bg-gray-50 shadow"
          disabled={currentPage === correctedTotalPage}
          onClick={handleNextClick}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex  bg-gray-50 shadow"
          disabled={currentPage === correctedTotalPage}
          onClick={handleLastPageClick}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="fixed bottom-2 left-2 items-center md:hidden space-x-2">
        <Button
          variant="outline"
          className=" h-8 w-8 p-0  bg-gray-50 shadow"
          disabled={currentPage === 1}
          onClick={handleFirstPageClick}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className=" h-8 w-8 p-0 bg-gray-50 shadow"
          disabled={currentPage === 1}
          onClick={handlePrevClick}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className=" h-8 w-8 p-0  bg-gray-50 shadow"
          disabled={currentPage === correctedTotalPage}
          onClick={handleNextClick}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className=" h-8 w-8 p-0 bg-gray-50 shadow"
          disabled={currentPage === correctedTotalPage}
          onClick={handleLastPageClick}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
