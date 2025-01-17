"use client"

import React, { useState, useRef, useEffect } from 'react';
import MobileBarcodeScanner from '@/components/MobileBarcodeScanner';
import { SCAN_DUPLICATE_MESSAGE } from '@/constants/constants';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  error?: string | null;
  checkDuplicate: (data: string) => boolean;
}

export default function BarcodeScanner({ onScan, error, checkDuplicate }: BarcodeScannerProps) {
  const [inputValue, setInputValue] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showCamera && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCamera]);

  const validateBarcode = (code: string): boolean => {
    code = code.trim();

    if (code.length < 31) {
      setValidationError('Barcode muss mindestens 31 Zeichen lang sein');
      return false;
    }

    if (code.slice(0, 3) !== 'DVS') {
      setValidationError('Barcode muss mit "DVS" beginnen');
      return false;
    }

    if (code[3] !== 'C') {
      setValidationError('Position 4 muss "C" sein');
      return false;
    }

    const sendungsId = code.slice(4, 20);
    if (!/^\d{16}$/.test(sendungsId)) {
      setValidationError('Sendungs_ID muss 16 Ziffern enthalten');
      return false;
    }

    const einspeiserId = code.slice(20, 25);
    if (!/^\d{5}$/.test(einspeiserId)) {
      setValidationError('Einspeiser_ID muss 5 Ziffern enthalten');
      return false;
    }

    const zustellpartnerId = code.slice(25, 28);
    if (!/^\d{3}$/.test(zustellpartnerId)) {
      setValidationError('Zustellpartner_ID muss 3 Ziffern enthalten');
      return false;
    }

    const abladestellenId = code[28];
    if (!/^\d{1}$/.test(abladestellenId)) {
      setValidationError('Abladestellen_ID muss 1 Ziffer enthalten');
      return false;
    }

    const produktCode = code.slice(29, 31);
    if (!/^\d{2}$/.test(produktCode)) {
      setValidationError('Produktcode muss 2 Ziffern enthalten');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      if (validateBarcode(inputValue)) {
        if (checkDuplicate(inputValue)) {
          setValidationError(SCAN_DUPLICATE_MESSAGE);
        } else {
          onScan(inputValue + '\r\n');
          setInputValue('');
          setValidationError('');
        }
      }
    }
  };

  const handleCameraToggle = () => {
    setShowCamera(!showCamera);
    setValidationError('');
  };

  const handleCameraScan = (data: string) => {
    if (validateBarcode(data)) {
      if (checkDuplicate(data)) {
        setValidationError(SCAN_DUPLICATE_MESSAGE);
      } else {
        onScan(data);
        setValidationError('');
      }
    }
  };

  return (
    <div className="space-y-4">
      {showCamera ? (
        <div className="relative">
          <MobileBarcodeScanner 
            onScan={handleCameraScan} 
            error={error} 
            checkDuplicate={checkDuplicate}
            isMobile={false}
            isActive={showCamera}
          />
          <button
            onClick={handleCameraToggle}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setValidationError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Bitte Barcode scannen oder eingeben"
              className={`flex-1 p-2 border rounded focus:outline-none focus:ring-0 focus:border-[var(--dvs-orange)] transition-colors ${
                validationError || error
                  ? 'border-[var(--dvs-orange)]'
                  : 'border-gray-200'
              }`}
            />
            <button
              onClick={handleCameraToggle}
              className="p-2 border rounded hover:bg-gray-50"
              title="Kamera verwenden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          {(validationError || error) && (
            <div className="flex items-center gap-2 p-3 bg-[#fff9f5] border border-[#ff6600]/20 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6600]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-[#4a4a4a] font-medium">{validationError || error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}