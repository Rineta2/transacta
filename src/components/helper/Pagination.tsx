import React from 'react';
import ReactPaginate from 'react-paginate';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <ReactPaginate
        pageCount={Math.max(1, pageCount)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        forcePage={currentPage}
        onPageChange={({ selected }) => onPageChange(selected)}
        containerClassName="flex items-center justify-center gap-1"
        pageClassName="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-200"
        pageLinkClassName="focus:outline-none"
        activeClassName="!bg-indigo-50 !text-indigo-600 hover:!bg-indigo-100"
        previousClassName="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-200"
        nextClassName="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 rounded-xl transition-colors duration-200"
        breakClassName="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white"
        disabledClassName="opacity-50 cursor-not-allowed hover:bg-white"
        previousLabel={<FaAnglesLeft className="h-5 w-5" />}
        nextLabel={<FaAnglesRight className="h-5 w-5" />}
        breakLabel="..."
        renderOnZeroPageCount={null}
      />
    </div>
  );
}