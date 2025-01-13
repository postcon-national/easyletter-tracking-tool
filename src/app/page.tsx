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

  const [data, setData] = useState<Code[]>(codes);
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
    return data.some(item => item.dmc === scannedData.trim());
  }, [data]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white shadow-sm">
        <div className={`mx-auto px-4 py-4 ${!isMobile ? 'max-w-7xl sm:px-6 lg:px-8 py-6' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`font-bold text-[#4a4a4a] ${isMobile ? 'text-xl' : 'text-2xl'}`}>SC-Scan</h1>
              <p className="text-sm text-[#666666] mt-1">Sortierzentrum Eingangsscan</p>
            </div>
            <div className="flex items-center">
              <Image 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
                alt="DVS Logo" 
                className={`object-contain ${isMobile ? 'h-8 w-auto' : 'h-12 w-auto'}`}
                width={isMobile ? 150 : 200}
                height={isMobile ? 150 : 200}
              />
            </div>
          </div>
        </div>
      </header>

      <main className={`mx-auto ${isMobile ? 'px-2 py-2' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>
        {isMobile ? (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Mobile Navigation */}
            <nav className="flex bg-white shadow-sm mb-2">
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'scan'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)] bg-[var(--dvs-orange)]/5'
                    : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3 4.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 4.5v15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 19.5v-15Zm5.25-1.5a.75.75 0 0 0-.75.75v.75h9v-.75a.75.75 0 0 0-.75-.75h-7.5Zm5.25 4.5h3.75v3.75h-3.75V7.5Zm-4.5 0h3.75v3.75h-3.75V7.5ZM7.5 12h3.75v3.75H7.5V12Zm4.5 0h3.75v3.75H12V12Z" />
                </svg>
                Scanner
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'table'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)] bg-[var(--dvs-orange)]/5'
                    : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" />
                </svg>
                Übersicht {data.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[var(--dvs-orange)]/10 text-[var(--dvs-orange)] text-xs">
                    {data.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'scan' ? (
                <div className="bg-white rounded-lg shadow-sm p-3 h-full">
                  <MobileBarcodeScanner 
                    onScan={handleScan} 
                    error={alertMessage} 
                    checkDuplicate={checkDuplicate}
                    isMobile={isMobile}
                    isActive={activeTab === 'scan'}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-3 h-full overflow-auto">
                  <DataTable
                    columns={columns}
                    data={data}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    isMobile={isMobile}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                  <div className="flex justify-end mt-4 space-x-2">
                    <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
                    <ExportButton onExport={handleExport} disabled={data.length === 0} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <BarcodeScanner onScan={handleScan} error={alertMessage} checkDuplicate={checkDuplicate} />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DataTable
                columns={columns}
                data={data}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                isMobile={isMobile}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
              
              <div className="flex justify-end mt-6 space-x-4">
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