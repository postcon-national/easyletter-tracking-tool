import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

const MobileBarcodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    if (scannedData) {
      onScan(scannedData);
      setScannedData(''); // Clear the scanned data after processing
    }
  }, [scannedData, onScan]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          setScannedData(code.data);
        }
      }
      requestAnimationFrame(tick);
    };

    startVideo();

    return () => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-center mb-4">QR Code Scanner</h1>
      <video ref={videoRef} className="w-full sm:w-auto" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default MobileBarcodeScanner;