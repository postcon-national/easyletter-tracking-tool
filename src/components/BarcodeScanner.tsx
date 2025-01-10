import React, { useState, useEffect, useRef } from 'react';

interface BarcodeScannerProps {
  onScan: (scannedData: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Maintain focus only when window/document regains focus
  useEffect(() => {
    const focusInput = () => {
      // Only refocus if no other element is actively focused
      if (document.activeElement === document.body) {
        inputRef.current?.focus();
      }
    };

    // Refocus when window gains focus
    window.addEventListener('focus', focusInput);

    return () => {
      window.removeEventListener('focus', focusInput);
    };
  }, []);

  const validateBarcode = (code: string): boolean => {
    // Remove any whitespace
    code = code.trim();

    // Basic length check
    if (code.length < 31) {
      setError('Barcode muss mindestens 31 Zeichen lang sein');
      return false;
    }

    // Check fixed values
    if (code.slice(0, 3) !== 'DVS') {
      setError('Barcode muss mit "DVS" beginnen');
      return false;
    }

    if (code[3] !== 'C') {
      setError('Position 4 muss "C" sein');
      return false;
    }

    // Check Sendungs_ID (positions 5-20)
    const sendungsId = code.slice(4, 20);
    if (!/^\d{16}$/.test(sendungsId)) {
      setError('Sendungs_ID muss 16 Ziffern enthalten');
      return false;
    }

    // Check Einspeiser_ID (positions 21-25)
    const einspeiserId = code.slice(20, 25);
    if (!/^\d{5}$/.test(einspeiserId)) {
      setError('Einspeiser_ID muss 5 Ziffern enthalten');
      return false;
    }

    // Check Zustellpartner_ID (positions 26-28)
    const zustellpartnerId = code.slice(25, 28);
    if (!/^\d{3}$/.test(zustellpartnerId)) {
      setError('Zustellpartner_ID muss 3 Ziffern enthalten');
      return false;
    }

    // Check Abladestellen_ID (position 29)
    const abladestellenId = code[28];
    if (!/^\d{1}$/.test(abladestellenId)) {
      setError('Abladestellen_ID muss 1 Ziffer enthalten');
      return false;
    }

    // Check Produktcode (positions 30-31)
    const produktCode = code.slice(29, 31);
    if (!/^\d{2}$/.test(produktCode)) {
      setError('Produktcode muss 2 Ziffern enthalten');
      return false;
    }

    setError('');
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.trim()) {
      if (validateBarcode(barcode)) {
        onScan(barcode);
        setBarcode(''); // Clear the input after saving
        setError(''); // Clear any previous error
      }
      // Ensure focus remains after scanning
      inputRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={barcode}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Bitte Barcode scannen oder eingeben"
        className={`border p-2 rounded w-full lg:w-1/2 ${error ? 'border-red-500' : 'text-gray-700'}`}
        autoFocus
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default BarcodeScanner;