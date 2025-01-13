import React from 'react';

interface EmptyStateProps {
  isMobile: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isMobile }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg">
      <div className="w-24 h-24 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[var(--dvs-gray)]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
          <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 8h8M8 12h8M8 16h8" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-[var(--dvs-gray-dark)] mb-2">
        Keine Barcodes gescannt
      </h3>
      <p className="text-sm text-[var(--dvs-gray)] text-center max-w-sm">
        {isMobile 
          ? "Tippen Sie auf 'Scanner', um Barcodes zu erfassen."
          : "Klicken Sie auf das Kamera-Symbol, um Barcodes zu scannen."}
      </p>
    </div>
  );
};

export default EmptyState; 