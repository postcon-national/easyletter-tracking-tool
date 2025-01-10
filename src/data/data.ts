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

type StatusType = "VALID" | "NON_VALID" | "REDIRECTED";

const statusClasses: Record<StatusType, string> = {
  VALID:
    "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium",
  NON_VALID:
    "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium",
  REDIRECTED:
    "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium",
};

const formatStatus = (status: string) => {
  return `<span class="${
    statusClasses[status as StatusType] ||
    "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
  }">${status}</span>`;
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
    format: formatStatus,
  },
  { key: "erfasser", label: "Erfasst von" },
  { key: "zust", label: "ZUP" },
];

export const codes: Code[] = [];
