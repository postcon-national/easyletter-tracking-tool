'use client'

import React, { useState, useCallback, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import MobileBarcodeScanner from '@/components/MobileBarcodeScanner';
import DataTable from '@/components/DataTable';
import DeleteButton from '@/components/DeleteButton';
import ExportButton from '@/components/ExportButton';
import { codes, columns } from '@/data/data';
import useWindowSize from '@/hooks/useWindowSize';
import { exportToCSV } from '@/utils/cvs/functions';
import { Code, StatusType } from '@/types/types';

const LOCAL_STORAGE_KEY = 'sc-scan-data';

const Home: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [data, setData] = useState<Code[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRows, setSelectedRows] = useState<Code[]>([]);

  // Load data from localStorage or initial data when component mounts (client-side only)
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      setData(codes);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const handleDelete = () => {
    setData(data.filter((row: Code) => !selectedRows.includes(row)));
    setSelectedRows([]);
  };

  const handleExport = async () => {
    exportToCSV(data, setData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData([]);
  };

  const handleScan = useCallback((scannedData: string) => {
    const newEntry: Code = {
      id: (data.length + 1).toString(),
      sidDVS: scannedData.slice(4, 20),
      sidZup: scannedData.slice(4, 20),
      dmc: scannedData,
      gam: new Date().toISOString(),
      status: "VALID" as StatusType,
      erfasser: '4202',
      zust: scannedData.slice(25, 28),
    };
    setData(prevData => [...prevData, newEntry]);
  }, [data.length]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#4a4a4a]">SC-Scan</h1>
              <p className="text-sm text-[#666666] mt-1">Sortierzentrum Eingangsscan</p>
            </div>
            <div className="flex items-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
                alt="DVS Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {isMobile ? <MobileBarcodeScanner onScan={handleScan} /> : <BarcodeScanner onScan={handleScan} />}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <DataTable
            columns={columns}
            data={data}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          
          <div className="flex justify-end mt-6 space-x-4">
            <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
            <ExportButton onExport={handleExport} disabled={data.length === 0} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;