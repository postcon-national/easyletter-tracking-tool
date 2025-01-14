"use client"

import React, { useEffect, useState } from 'react';
import useWindowSize from '@/hooks/useWindowSize';

const Main: React.FC<{children: React.ReactNode;}> = ({children}) => {
    const { width } = useWindowSize();

    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        setIsMobile(width <= 768);
      }, [width]);

    return (
        <main className={`mx-auto ${isMobile ? 'p-2' : 'max-w-7xl px-6 py-6'} space-y-6`}>
            {children}
        </main>
    );
};

export default Main;