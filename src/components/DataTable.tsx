"use client"

import React, { useState } from 'react';
import { Code, Column } from '@/types/types';
import StatusTag from './StatusTag';

interface DataTableProps {
  columns: Array<Column<Code>>;
  data: Code[];
  selectedRows: Code[];
  setSelectedRows: (rows: Code[]) => void;
  isMobile: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
}

type SortConfig = {
  key: keyof Code | null;
  direction: 'asc' | 'desc';
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  selectedRows,
  setSelectedRows,
  isMobile,
  itemsPerPage = 10,
  onItemsPerPageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSelectRow = (row: Code) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...data]);
    }
  };

  const handleSort = (key: keyof Code) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = sortedData.filter(row => 
    Object.values(row).some(value => 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setCurrentPage(1); // Reset to first page when changing items per page
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newValue);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        ←
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded transition-colors ${
            currentPage === i
              ? 'bg-[var(--dvs-orange)] text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        →
      </button>
    );

    return buttons;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--dvs-gray-light)] rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--dvs-gray)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2m4-7h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="font-geist-sans">
            <h3 className="text-lg font-medium text-[var(--dvs-gray-dark)]">Keine Barcodes gescannt</h3>
            <p className="text-[var(--dvs-gray)] mt-1">Scannen Sie einen Barcode, um ihn der Liste hinzuzufügen.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Info Bar */}
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-[var(--dvs-gray)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Suchen..."
            className={`pl-10 pr-4 py-2 border rounded-lg text-sm text-[var(--dvs-gray-dark)] focus:outline-none focus:ring-0 focus:border-[var(--dvs-orange)] transition-colors ${isMobile ? 'w-full' : 'w-64'}`}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-[var(--dvs-gray)]">
              Einträge pro Seite:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="text-sm border rounded-lg py-1 px-2 text-[var(--dvs-gray-dark)] focus:outline-none focus:ring-0 focus:border-[var(--dvs-orange)] transition-colors"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="text-sm text-[var(--dvs-gray)]">
            {filteredData.length} {filteredData.length === 1 ? 'Eintrag' : 'Einträge'} gefunden
            {selectedRows.length > 0 && (
              <span className="ml-2 text-[var(--dvs-orange)]">
                • {selectedRows.length} {selectedRows.length === 1 ? 'Eintrag' : 'Einträge'} ausgewählt
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[var(--dvs-gray-light)]">
            <tr>
              <th className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} w-10`}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="form-checkbox h-4 w-4 rounded border-gray-200 text-[var(--dvs-orange)] focus:ring-0 focus:border-[var(--dvs-orange)] transition-colors checked:bg-[var(--dvs-orange)] checked:hover:bg-[var(--dvs-orange)] hover:bg-[var(--dvs-orange)]/10"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  onClick={() => handleSort(column.key)}
                  className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-left text-xs font-medium text-[var(--dvs-gray)] uppercase tracking-wider cursor-pointer group hover:text-[var(--dvs-gray-dark)] select-none ${
                    isMobile && (column.key === 'dmc' || column.key === 'gam' || column.key === 'status') ? '' : isMobile ? 'hidden' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    <div className="flex flex-col text-[var(--dvs-orange)] opacity-0 group-hover:opacity-50">
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className={`transition-colors ${
                  selectedRows.includes(row) 
                    ? 'bg-[#fff9f5]' 
                    : 'hover:bg-[#fafafa]'
                }`}
              >
                <td className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'}`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row)}
                    onChange={() => handleSelectRow(row)}
                    className="form-checkbox h-4 w-4 rounded border-gray-200 text-[var(--dvs-orange)] focus:ring-0 focus:border-[var(--dvs-orange)] transition-colors checked:bg-[var(--dvs-orange)] checked:hover:bg-[var(--dvs-orange)] hover:bg-[var(--dvs-orange)]/10"
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.key.toString()}`}
                    className={`${isMobile ? 'px-2 py-2' : 'px-4 py-3'} text-sm text-[var(--dvs-gray-dark)] whitespace-nowrap ${
                      isMobile && (column.key === 'dmc' || column.key === 'gam' || column.key === 'status') ? '' : isMobile ? 'hidden' : ''
                    }`}
                  >
                    {column.key === 'status' ? (
                      <StatusTag status={row[column.key]} />
                    ) : column.format ? (
                      column.format(row[column.key])
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex justify-center gap-2 items-center ${isMobile ? 'text-sm' : ''}`}>
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
}

export default DataTable;
