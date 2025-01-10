export interface Code {
  sidDVS: string;
  sidZup: string;
  dmc: string;
  gam: string;
  status: string;
  erfasser: string;
  zust: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T> {
  key: keyof T;
  label: string;
  format?: (value: any) => string;
}
