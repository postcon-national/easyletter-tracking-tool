import { Column, Code } from '@/types/types';

export const columns: Array<Column<Code>> = [
  { key: 'sidDVS', label: 'Sendungs-ID (DVS)' },
  { key: 'sidZup', label: 'Sendungs-ID (ZUP)' },
  { key: 'dmc', label: 'Datamatrix Code' },
  { key: 'gam', label: 'Gescannt am' },
  { key: 'status', label: 'Status' },
  { key: 'erfasser', label: 'Erfasser' },
  { key: 'zust', label: 'Zusteller' },
];

export const codes: Code[] = [
  // {
  //   sidDVS: '123456',
  //   sidZup: '654321',
  //   dmc: 'ABC123',
  //   gam: '2023-10-01',
  //   status: 'Delivered',
  //   erfasser: 'John Doe',
  //   zust: 'Jane Smith',
  // },
  // {
  //   sidDVS: '789012',
  //   sidZup: '210987',
  //   dmc: 'DEF456',
  //   gam: '2023-10-02',
  //   status: 'In Transit',
  //   erfasser: 'Alice Johnson',
  //   zust: 'Bob Brown',
  // },
  // {
  //   sidDVS: '345678',
  //   sidZup: '876543',
  //   dmc: 'GHI789',
  //   gam: '2023-10-03',
  //   status: 'Pending',
  //   erfasser: 'Charlie Davis',
  //   zust: 'Eve White',
  // },
];