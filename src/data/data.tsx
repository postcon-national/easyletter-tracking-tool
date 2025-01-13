'use client';

import React from 'react';
import { Column, Code } from '../types/types';

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const columns: Column<Code>[] = [
  { key: "sidDVS", label: "Sendungs-ID (DVS)" },
  { key: "sidZup", label: "Sendungs-ID (ZUP)" },
  { key: "dmc", label: "Data-Matrix-Code" },
  {
    key: "gam",
    label: "Scan-Datum",
    format: formatDateTime,
  },
  {
    key: "erfasser",
    label: "Erfasst von",
    cell: (value: string) => (
      <div className="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
             className="w-4 h-4 text-[var(--dvs-orange)] opacity-90">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-[var(--dvs-orange)]">{value}</span>
      </div>
    ),
  },
  { key: "status", label: "Status" },
  { key: "zust", label: "ZUP" },
]; 