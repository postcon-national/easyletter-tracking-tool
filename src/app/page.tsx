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
import { scan } from '@/utils/scan/functions';
import { Code } from '@/types/types';
import Image from 'next/image';

const LOCAL_STORAGE_KEY = 'sc-scan-data';

const Home: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [data, setData] = useState<Code[]>(codes);
  const [selectedRows, setSelectedRows] = useState<Code[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Load data from localStorage when the component mounts (client-side only)
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setData(JSON.parse(savedData));
      }
      setIsDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes (client-side only)
    if (typeof window !== 'undefined' && isDataLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isDataLoaded]);

  const handleDelete = () => {
    setData(data.filter(row => !selectedRows.includes(row)));
    setSelectedRows([]);
  };

  const handleExport = async () => {
    await exportToCSV(data, setData);
    // Clear data from localStorage after exporting
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleScan = useCallback((scannedData: string) => {
    const trimmedData = scannedData.trim();
    const exists = data.some(item => item.dmc === trimmedData);

    if (!exists) {
      scan(trimmedData, data, setData);
      setAlertMessage(null); // Clear any previous alert message
    } else {
      setAlertMessage('The scanned data already exists in the list.');
      // Clear the alert message after 5 seconds
      setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
    }
  }, [data]);

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
              <Image 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
                alt="DVS Logo" 
                className="h-12 w-auto object-contain"
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alertMessage && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {alertMessage}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">

        {isMobile ? (
          <MobileBarcodeScanner onScan={handleScan} />
        ) : (
          <BarcodeScanner onScan={handleScan} />
        )}
        <DataTable
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        {selectedRows && data && (
             <div className="flex justify-end mt-6 space-x-4">
             <DeleteButton onDelete={handleDelete} disabled={selectedRows?.length === 0} /> 
             <ExportButton onExport={handleExport} disabled={data?.length === 0} />
           </div>
          )}
          </div>
      </main>
    </div>
  );
};

export default Home;