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

const LOCAL_STORAGE_KEY = 'easyletter-tracking-tool-data';
const ITEMS_PER_PAGE_KEY = 'easyletter-tracking-tool-items-per-page';

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
  const [isExporting, setIsExporting] = useState(false);

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
    try {
      setIsExporting(true);
      setAlertMessage(null);
      await exportToCSV(data, setData);
      setAlertMessage('Datei erfolgreich hochgeladen');
      // Clear message after 3 seconds
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      setAlertMessage(`Export fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsExporting(false);
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
    <div className="min-h-screen bg-[var(--dvs-gray-light)] relative">
      <div className="absolute inset-0 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-white via-[var(--dvs-gray-light)] to-[var(--dvs-gray-light)] opacity-40" />
      <div className="absolute inset-0" style={{ 
        backgroundImage: `radial-gradient(var(--dvs-orange) 0.5px, transparent 0.5px), radial-gradient(var(--dvs-orange) 0.5px, var(--dvs-gray-light) 0.5px)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        opacity: 0.05
      }} />
      <div className="relative">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200/50">
          <div className={`mx-auto ${isMobile ? 'px-4 py-2' : 'max-w-7xl px-6 py-4'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className={`absolute -inset-2 bg-[var(--dvs-orange)]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${isMobile ? 'hidden' : ''}`} />
                  <Image 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
                    alt="DVS Logo" 
                    className="relative object-contain transition-transform group-hover:scale-105 duration-300"
                    width={isMobile ? 32 : 44}
                    height={isMobile ? 32 : 44}
                    priority
                  />
                </div>
                {!isMobile && <div className="h-8 w-px bg-gradient-to-b from-gray-200/40 via-gray-200 to-gray-200/40" />}
                <h1 className={`font-semibold text-[var(--dvs-gray-dark)] ${isMobile ? 'text-base' : 'text-xl'} tracking-tight`}>
                  {isMobile ? 'Tracking Tool' : 'Easyletter Tracking Tool'}
                </h1>
              </div>
              
              <div className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5' : 'px-4 py-2.5'} rounded-lg border border-[var(--dvs-orange)]/10 bg-gradient-to-r from-[var(--dvs-orange)]/5 to-transparent hover:from-[var(--dvs-orange)]/10 hover:to-[var(--dvs-orange)]/5 transition-all duration-300`}>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--dvs-orange)]/5 animate-ping" style={{ animationDuration: '3s' }} />
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                       className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-[var(--dvs-orange)] opacity-90 relative`}>
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    {!isMobile && <span className="text-sm font-medium text-[var(--dvs-gray)]">Station</span>}
                    <span className="font-semibold text-[var(--dvs-orange)]">4202</span>
                    <span className={`inline-flex items-center rounded-full bg-gradient-to-r from-green-50 to-green-50/50 ${isMobile ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-xs'} font-medium text-green-700 ring-1 ring-inset ring-green-600/20`}>
                      Aktiv
                    </span>
                  </div>
                  {!isMobile && <span className="text-xs text-[var(--dvs-gray)]">Deutscher Versand Service</span>}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={`mx-auto ${isMobile ? 'p-2' : 'max-w-7xl px-6 py-6'} space-y-6`}>
          {alertMessage && (
            <div className={`rounded-lg p-4 ${
              alertMessage.includes('erfolgreich') 
                ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
            } text-sm animate-fade-in`}>
              {alertMessage}
            </div>
          )}
          {isMobile ? (
            <div className="flex flex-col h-[calc(100vh-96px)]">
              <nav className="flex bg-white rounded-xl shadow-sm mb-2 p-1">
                <button
                  onClick={() => setActiveTab('scan')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 rounded-lg
                    outline-none focus:outline-none focus-visible:outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-[var(--dvs-orange)]/20 focus-visible:ring-offset-1 [--tw-ring-color:transparent]
                    ${activeTab === 'scan'
                      ? 'text-[var(--dvs-orange)] bg-gradient-to-br from-[var(--dvs-orange)]/10 via-[var(--dvs-orange)]/5 to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-[var(--dvs-orange)]/10'
                      : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gradient-to-br hover:from-gray-50 hover:to-transparent border border-transparent hover:border-gray-100'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                       className={`w-4 h-4 transition-all duration-300 ${activeTab === 'scan' ? 'scale-110 opacity-90' : 'opacity-70'}`}>
                    <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6zm1.5 1.5h9a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 15V6a1.5 1.5 0 0 1 1.5-1.5zm0 3V12h9V7.5h-9zm0 6V18h9v-4.5h-9z" />
                  </svg>
                  Scanner
                </button>
                <button
                  onClick={() => setActiveTab('table')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 rounded-lg
                    outline-none focus:outline-none focus-visible:outline-none ring-offset-white focus-visible:ring-2 focus-visible:ring-[var(--dvs-orange)]/20 focus-visible:ring-offset-1 [--tw-ring-color:transparent]
                    ${activeTab === 'table'
                      ? 'text-[var(--dvs-orange)] bg-gradient-to-br from-[var(--dvs-orange)]/10 via-[var(--dvs-orange)]/5 to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] border border-[var(--dvs-orange)]/10'
                      : 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-gradient-to-br hover:from-gray-50 hover:to-transparent border border-transparent hover:border-gray-100'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                       className={`w-4 h-4 transition-all duration-300 ${activeTab === 'table' ? 'scale-110 opacity-90' : 'opacity-70'}`}>
                    <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V5.25A2.25 2.25 0 0 0 18.75 3H5.25zM6.75 7.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 4.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 4.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75z" />
                  </svg>
                  <span className="relative">Übersicht</span>
                  {data.length > 0 && (
                    <span className="relative ml-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--dvs-orange)]/10 to-[var(--dvs-orange)]/5 text-[var(--dvs-orange)] text-xs font-medium ring-1 ring-inset ring-[var(--dvs-orange)]/10 [--tw-ring-color:transparent]">
                      {data.length}
                    </span>
                  )}
                </button>
              </nav>

              <div className="flex-1 overflow-hidden">
                {activeTab === 'scan' ? (
                  <div className="bg-white rounded-xl shadow-sm p-2 h-full backdrop-blur-sm bg-white/80">
                    <MobileBarcodeScanner 
                      onScan={handleScan} 
                      error={alertMessage} 
                      checkDuplicate={checkDuplicate}
                      isMobile={isMobile}
                      isActive={activeTab === 'scan'}
                    />
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-2 h-full overflow-auto">
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
                      <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} isMobile={true} /> 
                      <ExportButton 
                        onExport={handleExport} 
                        disabled={data.length === 0 || isExporting} 
                        isMobile={true} 
                        isLoading={isExporting}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--dvs-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <BarcodeScanner onScan={handleScan} error={alertMessage} checkDuplicate={checkDuplicate} />
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-5">
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
                  <DeleteButton onDelete={handleDelete} disabled={selectedRows.length === 0} isMobile={false} /> 
                  <ExportButton 
                    onExport={handleExport} 
                    disabled={data.length === 0 || isExporting} 
                    isMobile={false} 
                    isLoading={isExporting}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;