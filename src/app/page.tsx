'use client'

import React, { useState, useCallback, useEffect } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import MobileBarcodeScanner from '@/components/MobileBarcodeScanner';
import DataTable from '@/components/DataTable';
import DeleteButton from '@/components/DeleteButton';
import ExportButton from '@/components/ExportButton';
import { columns } from '@/data/data';
import useWindowSize from '@/hooks/useWindowSize';
import { exportToCSV, downloadCSV } from '@/utils/cvs/functions';
import { scan } from '@/utils/scan/functions';
import { Code } from '@/types/types';
import IconExportSuccess from '@/components/svg/IconExportSuccess';
import IconExportError from '@/components/svg/IconExportError';
import IconDismiss from '@/components/svg/IconDismiss';
import IconScan from '@/components/svg/IconScan';
import IconList from '@/components/svg/IconList';
import DownloadDialog from '@/components/DownloadDialog';
import { ITEMS_PER_PAGE_KEY, LOCAL_STORAGE_KEY } from '@/constants/constants'; 

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
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [scannerMessage, setScannerMessage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<{ data: Code[], filename: string } | null>(null);

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
      setExportMessage(null);
      await exportToCSV(data, setData);
      setExportMessage(`Datei erfolgreich hochgeladen`);
      setTimeout(() => setExportMessage(null), 3000);
    } catch (error) {
      if (error instanceof Error && error.message === "SFTP_FAILED") {
        // Show custom dialog instead of window.confirm
        const now = new Date();
        const timestamp =
          now.getFullYear().toString() +
          (now.getMonth() + 1).toString().padStart(2, "0") +
          now.getDate().toString().padStart(2, "0") +
          now.getHours().toString().padStart(2, "0") +
          now.getMinutes().toString().padStart(2, "0");
        
        const filename = `${timestamp}_${data[0].zust}_Trackingdaten_dvs.csv`;
        setPendingDownload({ data, filename });
        setShowDownloadDialog(true);
      } else {
        setExportMessage(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten");
        setTimeout(() => setExportMessage(null), 3000);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadConfirm = () => {
    if (pendingDownload) {
      const result = downloadCSV(pendingDownload.data, pendingDownload.filename);
      if (result.downloadComplete) {
        setData([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setShowDownloadDialog(false);
      setPendingDownload(null);
    }
  };

  const handleDownloadCancel = () => {
    setShowDownloadDialog(false);
    setPendingDownload(null);
  };

  const handleScan = useCallback((scannedData: string) => {
    const trimmedData = scannedData.trim();
    const exists = data.some(item => item.dmc === trimmedData);

    if (!exists) {
      scan(trimmedData, data, setData);
      setScannerMessage(null);
    } else {
      setScannerMessage('Dieser Barcode wurde bereits gescannt.');
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
    <> 
          {exportMessage && (
            <div 
              role="alert"
              className={`rounded-xl ${isMobile ? 'p-3' : 'p-4'} backdrop-blur-sm animate-fade-in flex items-center gap-4 shadow-lg relative overflow-hidden transition-opacity duration-300 ${
                exportMessage.includes('erfolgreich') 
                  ? 'bg-white text-[var(--dvs-gray-dark)] border border-[var(--dvs-orange)]/20' 
                  : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
              }`}>
              {/* Background gradient effect */}
              {exportMessage.includes('erfolgreich') && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--dvs-orange)]/10 via-[var(--dvs-orange)]/5 to-transparent animate-gradient" />
              )}
              
              {/* Icon container with pulsing effect */}
              <div className={`relative rounded-full ${isMobile ? 'p-1.5' : 'p-2'} ${
                exportMessage.includes('erfolgreich')
                  ? 'bg-[var(--dvs-orange)]/10'
                  : 'bg-red-100'
              }`}>
                {/* Pulse effect for success */}
                {exportMessage.includes('erfolgreich') && (
                  <div className="absolute inset-0 rounded-full bg-[var(--dvs-orange)]/20 animate-ping" />
                )}
                
                {exportMessage.includes('erfolgreich') ? (
                  <IconExportSuccess isMobile={isMobile} />
                ) : (
                  <IconExportError isMobile={isMobile} />
                )}
              </div>
              
              {/* Message text with enhanced styling */}
              <div className="flex-1 relative">
                <div className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                  {exportMessage}
                </div>
                {exportMessage.includes('erfolgreich') && (
                  <div className="text-[var(--dvs-gray)] text-sm mt-0.5">
                    Die Daten wurden erfolgreich auf den SFTP-Server hochgeladen
                  </div>
                )}
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setExportMessage(null)}
                className={`p-1.5 rounded-lg transition-colors duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dvs-orange)]/20 focus-visible:ring-offset-1 ${
                  exportMessage.includes('erfolgreich')
                    ? 'text-[var(--dvs-gray)] hover:text-[var(--dvs-gray-dark)] hover:bg-[var(--dvs-orange)]/5'
                    : 'text-red-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <IconDismiss />
              </button>
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
                  <IconScan activeTab={activeTab} />
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
                  <IconList activeTab={activeTab} />
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
                      error={scannerMessage} 
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
                  <BarcodeScanner onScan={handleScan} error={scannerMessage} checkDuplicate={checkDuplicate} />
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
      {/* Custom Download Dialog */}
      {showDownloadDialog && (
        <DownloadDialog onCancel={handleDownloadCancel} onConfirm={handleDownloadConfirm} />
      )}
    </>
  );
};

export default Home;