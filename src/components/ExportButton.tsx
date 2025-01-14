import React from 'react';

interface ExportButtonProps {
  onExport: () => void;
  disabled: boolean;
  className?: string;
  isMobile: boolean;
  isLoading?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport, disabled, className, isMobile, isLoading }) => {
  return (
    <button
      onClick={onExport}
      disabled={disabled || isLoading}
      title="Als CSV exportieren"
      className={className || `
        inline-flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'gap-1.5 px-3 py-1.5'} rounded-lg text-sm
        transition-all duration-300
        outline-none focus:outline-none focus-visible:outline-none
        ring-offset-white focus-visible:ring-2 focus-visible:ring-[var(--dvs-orange)]/20 focus-visible:ring-offset-1
        [--tw-ring-color:transparent]
        ${disabled || isLoading
          ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed focus-visible:ring-0'
          : 'text-[var(--dvs-orange)] bg-white/60 hover:bg-white/80 active:bg-white/90 backdrop-blur-sm border border-[var(--dvs-orange)]/10 shadow-sm hover:shadow-md active:shadow-sm'
        }
      `}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-[var(--dvs-orange)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" 
               className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} transition-opacity duration-200 ${disabled ? 'opacity-40' : 'opacity-80'}`}>
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          {!isMobile && 'Als CSV exportieren'}
        </>
      )}
    </button>
  );
};

export default ExportButton;