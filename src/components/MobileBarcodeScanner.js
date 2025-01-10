import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

const MobileBarcodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scannedData, setScannedData] = useState('');
  const [scannedList, setScannedList] = useState([]);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (scannedData && !wait) {
      onScan(scannedData);
    }
  }, [scannedData, onScan, wait]);

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
      if (wait) {
        return;
      }
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
          setWait(true);
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
  }, [wait]);


  const handleAddToList = () => {
    if (scannedData) {
      setScannedList([...scannedList, scannedData]);
      onScan(scannedData); // Send the scanned data to the parent component
      setScannedData(''); // Clear the input after adding to the list
      setWait(false); // Allow scanning again
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h1 className="text-center mb-4 text-gray-700">QR Code Scanner</h1>
      <video ref={videoRef} className="w-full sm:w-auto" />
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="text"
        value={scannedData}
        readOnly
        className="mt-4 p-2 border rounded w-full text-gray-700"
      />
      <button
        onClick={handleAddToList}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        📱 Accept QR 
      </button>
    </div>
  );
};

export default MobileBarcodeScanner;