"use client"

import React, { useRef, useEffect, useState, useCallback } from "react";
import jsQR from "jsqr";

interface MobileBarcodeScannerProps {
  onScan: (data: string) => void;
  error?: string | null;
  checkDuplicate: (data: string) => boolean;
  isMobile: boolean;
  isActive?: boolean;
}

const MobileBarcodeScanner: React.FC<MobileBarcodeScannerProps> = ({ 
  onScan, 
  error, 
  checkDuplicate,
  isMobile,
  isActive = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const lastScannedRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop the camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start the camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        streamRef.current = stream;
        
        const playVideo = async () => {
          try {
            await videoRef.current?.play();
            requestAnimationFrame(tick);
          } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') {
              setTimeout(playVideo, 100);
            } else {
              console.error("Error playing video:", err);
            }
          }
        };
        
        await playVideo();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  // Handle active state changes
  useEffect(() => {
    if (isActive) {
      setIsScanning(true);
      startCamera();
    } else {
      setIsScanning(false);
      stopCamera();
      // Reset refs when becoming inactive
      lastScannedRef.current = "";
      lastScanTimeRef.current = 0;
    }
    
    return () => {
      stopCamera();
    };
  }, [isActive, startCamera, stopCamera]);

  const tick = useCallback(() => {
    if (!isScanning || !isActive) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) return;
    
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      const now = Date.now();
      if (code && 
          code.data && 
          code.data.length >= 31 && 
          now - lastScanTimeRef.current > 2000 && 
          isScanning) {
        
        if (validateBarcode(code.data)) {
          setIsScanning(false);
          
          if (checkDuplicate(code.data)) {
            setValidationError('Dieser Barcode wurde bereits gescannt.');
            lastScanTimeRef.current = now;
            setTimeout(() => {
              setValidationError('');
              setIsScanning(true);
            }, 2000);
          } 
          else if (code.data === lastScannedRef.current) {
            setValidationError('Bitte warten Sie einen Moment, bevor Sie einen neuen Barcode scannen.');
            lastScanTimeRef.current = now;
            setTimeout(() => {
              setValidationError('');
              setIsScanning(true);
            }, 2000);
          } 
          else {
            onScan(code.data);
            lastScannedRef.current = code.data;
            lastScanTimeRef.current = now;
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setIsScanning(true);
            }, 2000);
          }
        } else {
          setIsScanning(false);
          setTimeout(() => {
            setIsScanning(true);
          }, 2000);
        }
      }
    }
    requestAnimationFrame(tick);
  }, [isScanning, isActive, checkDuplicate, onScan]);

  // Clear success message after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Clear error message after 2 seconds
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

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

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`relative ${isMobile ? 'w-full' : 'w-[400px]'}`}>
        {/* Video container with scanning overlay */}
        <div className={`relative ${isMobile ? 'aspect-[3/4]' : 'aspect-video'} rounded-lg overflow-hidden bg-black`}>
          {/* Background pattern */}
          <div className="absolute inset-0 scanner-background" />
          <video 
            ref={videoRef} 
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
          />
          {/* Success flash animation */}
          {showSuccess && (
            <div className="absolute inset-0 bg-white/30 animate-flash" />
          )}
          {/* Scanning overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/40">
              {/* Clear center area */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`relative ${isMobile ? 'w-56 h-56' : 'w-48 h-48'} bg-transparent`}>
                  {/* Cutout effect */}
                  <div className="absolute inset-0 backdrop-blur-none" />
                </div>
              </div>
            </div>
            <div className={`relative ${isMobile ? 'w-56 h-56' : 'w-48 h-48'}`}>
              {/* Corner markers with modern design */}
              <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl transition-colors duration-300 ${!isScanning ? 'border-white/60' : 'border-white'}`}></div>
              <div className={`absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 rounded-tr transition-colors duration-300 ${!isScanning ? 'border-white/60' : 'border-white'}`}></div>
              <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 rounded-bl transition-colors duration-300 ${!isScanning ? 'border-white/60' : 'border-white'}`}></div>
              <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br transition-colors duration-300 ${!isScanning ? 'border-white/60' : 'border-white'}`}></div>
              {/* Scanning line animation */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300 ${!isScanning ? 'bg-white/60' : 'bg-white animate-scan'}`}></div>
            </div>
          </div>
          {/* Scanning instructions with improved visibility */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="inline-block px-4 py-2 bg-white/90 rounded-lg shadow-lg">
              <p className="text-[var(--dvs-gray-dark)] text-base font-medium">
                {!isScanning ? 'Bitte warten...' : 'Barcode in den Rahmen halten'}
              </p>
            </div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Status display */}
      <div className={`${isMobile ? 'w-full' : 'w-[400px]'} mt-4`}>
        {showSuccess && (
          <div className="flex items-center gap-2 p-2.5 bg-[#fff9f5] border border-[var(--dvs-orange)]/20 rounded-lg animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--dvs-orange)] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[var(--dvs-gray-dark)]">Barcode erfolgreich gescannt</span>
          </div>
        )}
        {(validationError || error) && (
          <div className="flex items-center gap-2 p-2.5 bg-[#fff9f5] border border-[var(--dvs-orange)]/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--dvs-orange)] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[var(--dvs-gray-dark)]">{validationError || error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileBarcodeScanner; 