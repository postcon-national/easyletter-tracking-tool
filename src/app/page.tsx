'use client'

import React, { useState, useCallback, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import MobileBarcodeScanner from '@/components/MobileBarcodeScanner';
import DataTable from '@/components/DataTable';
import DeleteButton from '@/components/DeleteButton';
import ExportButton from '@/components/ExportButton';
import { columns } from '@/data/data';
import useWindowSize from '@/hooks/useWindowSize';
import { exportToCSV } from '@/utils/cvs/functions';
import { scan } from '@/utils/scan/functions';
import { Code } from '@/types/types';
import Image from 'next/image';

const LOCAL_STORAGE_KEY = 'sc-scan-data';
const ITEMS_PER_PAGE_KEY = 'sc-scan-items-per-page';

const Home: React.FC = () => {
  const { width } = useWindowSize();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'table'>('scan');
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ITEMS_PER_PAGE_KEY);
      return saved ? parseInt(saved, 10) : (width <= 768 ? 5 : 10);
    }
    return 10;
  });

  useEffect(() => {
    setIsMobile(width <= 768);
    setIsLoading(false);
  }, [width]);

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ITEMS_PER_PAGE_KEY, value.toString());
    }
  };

  const [data, setData] = useState<Code[]>([]);
  const [selectedRows, setSelectedRows] = useState<Code[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Only use saved data if it's not empty
        if (parsedData && parsedData.length > 0) {
          setData(parsedData);
        }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleScan = useCallback((scannedData: string) => {
    const trimmedData = scannedData.trim();
    const exists = data.some(item => item.dmc === trimmedData);

    if (!exists) {
      scan(trimmedData, data, setData);
      setAlertMessage(null);
    } else {
      setAlertMessage('Dieser Barcode wurde bereits gescannt.');
    }
  }, [data]);

  const checkDuplicate = useCallback((scannedData: string) => {
    // Force access to latest data state
    const currentData = data;
    if (!isDataLoaded) {
      console.log('Data not yet loaded');
      return false;
    }
    console.log('Checking duplicate with data length:', currentData.length);
    return currentData.some(item => item.dmc === scannedData.trim());
  }, [data, isDataLoaded]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--dvs-gray-light)]">
      <header className="bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.05)]">
        <div className={`mx-auto ${isMobile ? 'px-4 py-3' : 'max-w-7xl px-6 py-5'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-medium text-[var(--dvs-gray-dark)] ${isMobile ? 'text-lg' : 'text-xl'}`}>SC-Scan</h1>
              <p className={`text-[var(--dvs-gray)] ${isMobile ? 'text-xs mt-0.5' : 'text-sm mt-1'}`}>
                Sortierzentrum Eingangsscan
              </p>
            </div>
            <Image 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
              alt="DVS Logo" 
              className="object-contain transition-transform hover:scale-105"
              width={isMobile ? 48 : 56}
              height={isMobile ? 48 : 56}
              priority
            />
          </div>
        </div>
      </header>

      <main className={`mx-auto ${isMobile ? 'p-2' : 'max-w-7xl px-6 py-6'}`}>
        {isMobile ? (
          <div className="flex flex-col h-[calc(100vh-96px)]">
            <nav className="flex bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] mb-2">
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-all duration-200 rounded-l-xl ${
                  activeTab === 'scan'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)] bg-[var(--dvs-orange)]/5'
                    : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6zm1.5 1.5h9a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 15V6a1.5 1.5 0 0 1 1.5-1.5zm0 3V12h9V7.5h-9zm0 6V18h9v-4.5h-9z" />
                </svg>
                Scanner
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-all duration-200 rounded-r-xl ${
                  activeTab === 'table'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)] bg-[var(--dvs-orange)]/5'
                    : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V5.25A2.25 2.25 0 0 0 18.75 3H5.25zM6.75 7.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 4.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 4.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75z" />
                </svg>
                Übersicht {data.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--dvs-orange)]/10 text-[var(--dvs-orange)] text-xs font-medium">
                    {data.length}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex-1 overflow-hidden">
              {activeTab === 'scan' ? (
                <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] p-2 h-full">
                  <MobileBarcodeScanner 
                    onScan={handleScan} 
                    error={alertMessage} 
                    checkDuplicate={checkDuplicate}
                    isMobile={isMobile}
                    isActive={activeTab === 'scan'}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] p-2 h-full overflow-auto">
                  <DataTable
                    columns={columns}
                    data={data}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    isMobile={isMobile}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                  <div className="flex justify-end mt-3 space-x-2">
                    <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
                    <ExportButton onExport={handleExport} disabled={data.length === 0} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] p-5 mb-5">
              <BarcodeScanner onScan={handleScan} error={alertMessage} checkDuplicate={checkDuplicate} />
            </div>
            
            <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] p-5">
              <DataTable
                columns={columns}
                data={data}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                isMobile={isMobile}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
              
              <div className="flex justify-end mt-5 space-x-3">
                <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
                <ExportButton onExport={handleExport} disabled={data.length === 0} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;