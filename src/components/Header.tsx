"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Adjust the import based on your setup
import UserIcon from '@/components/svg/UserIcon';
import useWindowSize from '@/hooks/useWindowSize';

const Header: React.FC = () => {
    const { width } = useWindowSize();

    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        setIsMobile(width <= 768);
      }, [width]);

    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200/50">
            <div className={`mx-auto ${isMobile ? 'px-4 py-2' : 'max-w-7xl px-6 py-4'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className={`absolute -inset-2 bg-[var(--dvs-orange)]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${isMobile ? 'hidden' : ''}`} />
                            <Image 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5fSe7cesYu_vRdemQYmiXaa5mXb3dtHyPg&s"
                                alt="DVS Logo" 
                                className="relative object-contain transition-transform group-hover:scale-105 duration-300"
                                width={isMobile ? 32 : 44}
                                height={isMobile ? 32 : 44}
                                priority
                            />
                        </div>
                        {!isMobile && <div className="h-8 w-px bg-gradient-to-b from-gray-200/40 via-gray-200 to-gray-200/40" />}
                        <h1 className={`font-semibold text-[var(--dvs-gray-dark)] ${isMobile ? 'text-base' : 'text-xl'} tracking-tight`}>
                            {isMobile ? 'Tracking Tool' : 'Easyletter Tracking Tool'}
                        </h1>
                    </div>
                    
                    <div className={`flex items-center gap-2 ${isMobile ? 'px-2 py-1.5' : 'px-4 py-2.5'} rounded-lg border border-[var(--dvs-orange)]/10 bg-gradient-to-r from-[var(--dvs-orange)]/5 to-transparent hover:from-[var(--dvs-orange)]/10 hover:to-[var(--dvs-orange)]/5 transition-all duration-300`}>
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-[var(--dvs-orange)]/5 animate-ping" style={{ animationDuration: '3s' }} />
                            <UserIcon isMobile={isMobile} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                {!isMobile && <span className="text-sm font-medium text-[var(--dvs-gray)]">Station</span>}
                                <span className="font-semibold text-[var(--dvs-orange)]">4202</span>
                                <span className={`inline-flex items-center rounded-full bg-gradient-to-r from-green-50 to-green-50/50 ${isMobile ? 'px-1 py-0.5 text-[10px]' : 'px-1.5 py-0.5 text-xs'} font-medium text-green-700 ring-1 ring-inset ring-green-600/20`}>
                                    Aktiv
                                </span>
                            </div>
                            {!isMobile && <span className="text-xs text-[var(--dvs-gray)]">Deutscher Versand Service</span>}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;