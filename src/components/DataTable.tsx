"use client"

import React, { useState, useEffect } from 'react';
import { Column } from '@/types/types';

interface TableProps<T> {
  columns: Array<Column<T>>;
  data: T[];
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
}

export default function DataTable<T extends { id: string }>(props: TableProps<T>) {
  const { columns, data, selectedRows, setSelectedRows } = props;
  const [selectAll, setSelectAll] = useState(false);

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

  const renderCell = (column: Column<T>, value: T[keyof T]) => {
    if (column.format) {
      if (column.key === 'status') {
        return <div dangerouslySetInnerHTML={{ __html: column.format(value) }} />;
      }
      return column.format(value);
    }
    return String(value);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
            </th>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row)}
                  onChange={() => handleSelectRow(row)}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
              </td>
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-6 py-4 text-sm text-gray-700 ${column.key === 'id' ? 'hidden' : ''}`}
                >
                  {renderCell(column, row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
