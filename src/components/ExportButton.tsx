import React from 'react';

interface ExportButtonProps {
  onExport: () => void;
  disabled?: boolean;
  isMobile?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled = false, isMobile = false }) => {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5 
        ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5'} 
        font-medium rounded-xl transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-[var(--dvs-orange)] text-white hover:bg-[var(--dvs-orange)]/90 active:bg-[var(--dvs-orange)]/95'
        }
      `}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}
      >
        <path d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" />
      </svg>
      CSV-Export
    </button>
  );
};

export default ExportButton;