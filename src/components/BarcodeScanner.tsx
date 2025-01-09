import React, { useState, useEffect, useRef } from 'react';

interface BarcodeScannerProps {
  onScan: (scannedData: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [barcode, setBarcode] = useState('');
  const [debouncedBarcode, setDebouncedBarcode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBarcode(barcode);
    }, 2000); // 2 seconds debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [barcode]);

  useEffect(() => {
    if (debouncedBarcode) {
      onScan(debouncedBarcode);
      setBarcode(''); // Clear the input after saving
      setDebouncedBarcode(''); // Reset debouncedBarcode to prevent multiple scans
    }
  }, [debouncedBarcode, onScan]);

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={barcode}
        onChange={handleScan}
        placeholder="Scan barcode here"
        className="border p-2 rounded text-gray-700  w-full lg:w-1/2"
      />
    </div>
  );
};

export default BarcodeScanner;