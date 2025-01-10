"use client"

import React, { useState, useEffect } from 'react';
import { Column, StatusType } from '@/types/types';
import StatusTag from './StatusTag';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  CellContext,
} from '@tanstack/react-table';

interface TableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
}

export default function DataTable<T extends { id: string }>(props: TableProps<T>) {
  const { columns, data, selectedRows, setSelectedRows } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  // Convert our columns to TanStack Table format
  const tableColumns: ColumnDef<T>[] = [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={() => setSelectAll(!selectAll)}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.original)}
          onChange={() => handleSelectRow(row.original)}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
    },
    ...columns.map(col => ({
      id: String(col.key),
      accessorKey: col.key,
      header: col.label,
      cell: (props: CellContext<T, unknown>) => {
        const value = props.getValue() as T[keyof T];
        if (col.key === 'status') {
          return <StatusTag status={value as StatusType} />;
        }
        if (col.format) {
          return col.format(value);
        }
        return String(value);
      },
    })),
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(data);
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, data, setSelectedRows]);

  const handleSelectRow = (row: T) => {
    if (selectedRows?.includes(row)) {
      setSelectedRows(selectedRows?.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Suchen..."
            className="p-2 pl-10 border rounded w-64 focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 focus:border-[#ff6600]"
          />
        </div>
        <div className="text-sm text-gray-500">
          {table.getFilteredRowModel().rows.length} Einträge gefunden
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <span className="ml-2">
                        {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {'>>'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Seite {table.getState().pagination.pageIndex + 1} von{' '}
            {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="p-1 border rounded"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize} pro Seite
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
