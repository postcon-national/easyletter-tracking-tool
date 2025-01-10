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
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'table'>('scan');

  useEffect(() => {
    setIsMobile(width <= 768);
    setIsLoading(false);
  }, [width]);

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
          <>
            {/* Mobile Tab Navigation */}
            <div className="flex mb-3 bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'scan'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)]'
                    : 'text-[var(--dvs-gray)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Scanner
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'table'
                    ? 'text-[var(--dvs-orange)] border-b-2 border-[var(--dvs-orange)]'
                    : 'text-[var(--dvs-gray)]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Übersicht {data.length > 0 && <span className="ml-1">({data.length})</span>}
              </button>
            </div>

            {/* Mobile Content */}
            {activeTab === 'scan' ? (
              <div className="bg-white rounded-lg shadow-sm p-3">
                <MobileBarcodeScanner 
                  onScan={handleScan} 
                  error={alertMessage} 
                  checkDuplicate={checkDuplicate}
                  isMobile={isMobile}
                  isActive={activeTab === 'scan'}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-3">
                <DataTable
                  columns={columns}
                  data={data}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  isMobile={isMobile}
                />
                <div className="flex justify-end mt-4 space-x-2">
                  <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} /> 
                  <ExportButton onExport={handleExport} disabled={data.length === 0} />
                </div>
              </div>
            )}
          </>
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