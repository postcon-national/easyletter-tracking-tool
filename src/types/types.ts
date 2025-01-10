export type StatusType = "VALID" | "NON_VALID" | "REDIRECTED";

export interface Code {
  id: string;
  sidDVS: string;
  sidZup: string;
  dmc: string;
  gam: string;
  status: StatusType;
  erfasser: string;
  zust: string;
}


export interface Column<T> {
  key: keyof T;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: T[keyof T]) => string;
}
