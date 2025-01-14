// src/app/svg/IconScan.tsx
import React from 'react';

interface IconScanProps extends React.SVGProps<SVGSVGElement> {
    activeTab?: string; // Optional prop to handle active tab styles
}

const IconScan: React.FC<IconScanProps> = ({ activeTab, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-4 h-4 transition-all duration-300 ${activeTab === 'scan' ? 'scale-110 opacity-90' : 'opacity-70'}`}
            {...props}
        >
            <path d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6zm1.5 1.5h9a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 15V6a1.5 1.5 0 0 1 1.5-1.5zm0 3V12h9V7.5h-9zm0 6V18h9v-4.5h-9z" />
        </svg>
    );
};

export default IconScan;