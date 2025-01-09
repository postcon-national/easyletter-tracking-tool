import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';


const MobileBarcodeScanner = ({ onScan }) => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    if (scannedData) {
      onScan(scannedData);
      setScannedData(''); // Clear the scanned data after processing
    }
  }, [scannedData, onScan]);

  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1>QR Code Scanner</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default MobileBarcodeScanner;