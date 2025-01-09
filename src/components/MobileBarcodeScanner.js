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

  const handleScan = (result) => {
    if (result) {
      setScannedData(result.text);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-center mb-4">QR Code Scanner</h1>
      <div className="w-full sm:w-auto">
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result);
            }

            if (!!error) {
              handleError(error);
            }
          }}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default MobileBarcodeScanner;