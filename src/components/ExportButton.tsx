import React from 'react';

interface ExportButtonProps {
  onExport: () => void;
  disabled: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled }) => {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
        transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-[var(--dvs-orange)]/10 text-[var(--dvs-orange)] hover:bg-[var(--dvs-orange)]/20 active:bg-[var(--dvs-orange)]/30'
        }
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
      CSV-Datei herunterladen
    </button>
  );
};

export default ExportButton;