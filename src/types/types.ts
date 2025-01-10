export interface Code {
  sidDVS: string;
  sidZup: string;
  dmc: string;
  gam: string;
  status: string;
  erfasser: string;
  zust: string;
}

// types.ts (puedes usar el mismo archivo u otro distinto)

export interface Column<T> {
  key: keyof T;
  label: string;
  format?: (value: any) => string;
}
