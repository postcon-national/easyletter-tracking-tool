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

  const handleExport = async () => {
    try {
      // 1. Send the data to our API route
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 2. Convert the response to a Blob
      const blob = await response.blob();

      // 3. Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // 4. Create a temporary <a> element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.csv');
      document.body.appendChild(link);
      link.click();

      // Cleanup the link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // 5. Clear the exported data from local state
      setData([]);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleScan = useCallback((scannedData: string) => {
    const newEntry = {
      id: (data.length + 1).toString(),
      sidDVS: scannedData.slice(4, 20),
      sidZup: scannedData.slice(4, 20),
      dmc: scannedData,
      gam: new Date().toISOString(),
      status: 'VALID',
      erfasser: '4202',
      zust: '4202',
    };
    setData(prevData => [...prevData, newEntry]);
  }, [data.length]);

  console.log(JSON.stringify(data, null, 2));

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="bg-white shadow-sm rounded-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">SC-Scan</h1>
              <p className="text-sm text-gray-500 mt-1">Sortierzentrum Eingangsscan</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="border-l border-gray-200 h-12" />
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s" 
                alt="DVS Logo" 
                className="h-14 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {isMobile ? <MobileBarcodeScanner onScan={handleScan} /> : <BarcodeScanner onScan={handleScan} />}
        
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        
        <div className="flex justify-end space-x-4">
          <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
          <ExportButton onExport={handleExport} disabled={data.length === 0} />
        </div>
      </main>
    </div>
  );
};

export default Home;