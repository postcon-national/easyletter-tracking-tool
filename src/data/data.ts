import { Column, Code } from "@/types/types";

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

export const columns: Array<Column<Code>> = [
  { key: "sidDVS", label: "Sendungs-ID (DVS)" },
  { key: "sidZup", label: "Sendungs-ID (ZUP)" },
  { key: "dmc", label: "Data-Matrix-Code" },
  {
    key: "gam",
    label: "Scan-Datum",
    format: formatDateTime,
  },
  {
    key: "status",
    label: "Status",
  },
  { key: "erfasser", label: "Erfasst von" },
  { key: "zust", label: "ZUP" },
];

export const codes: Code[] = [];
