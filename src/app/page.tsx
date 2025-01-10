'use client'

import React, { useState, useCallback } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import MobileBarcodeScanner from '@/components/MobileBarcodeScanner';
import DataTable from '@/components/DataTable';
import DeleteButton from '@/components/DeleteButton';
import ExportButton from '@/components/ExportButton';
//import { exportToCSV } from '@/components';
import { codes, columns } from '@/data/data';
import useWindowSize from '@/hooks/useWindowSize';


const Home: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [data, setData] = useState(codes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleDelete = () => {
    setData(data.filter(row => !selectedRows.includes(row)));
    setSelectedRows([]);
  };

  const handleExport = () => {
    //  exportToCSV(data, 'scanned_data');
  };

  const handleScan = useCallback((scannedData: string) => {
    const newEntry = {
      id: (data.length + 1).toString(),
      sidDVS: scannedData.slice(4, 20),
      sidZup: scannedData.slice(4, 20),
      dmc: scannedData,
      gam: new Date().toISOString().split('T')[0],
      status: 'Delivered',
      erfasser: 'John Doe',
      zust: 'Jane Smith',
    };
    setData(prevData => [...prevData, newEntry]);
  }, [data.length]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between py-4">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-orange-500">Scanner Application</h1>
      </header>
      {isMobile ? <MobileBarcodeScanner onScan={handleScan} /> : <BarcodeScanner onScan={handleScan} />}
      {/* <BarcodeScanner onScan={handleScan} />
      <MobileBarcodeScanner onScan={handleScan} /> */}
      <DataTable
        columns={columns}
        data={data}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <div className="flex justify-end mt-4 space-x-4">
        <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
        <ExportButton onExport={handleExport} disabled={data.length === 0} />
      </div>
    </div>
  );
};

export default Home;