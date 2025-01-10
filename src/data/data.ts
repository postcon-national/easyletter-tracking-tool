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

// Function to generate a random date within the last 30 days
const getRandomDate = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// Function to generate a random sendungsId (16 digits)
const generateSendungsId = () => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
};

// Function to generate test data
// const generateTestData = (count: number): Code[] => {
//   return Array.from({ length: count }, (_, index) => {
//     const sendungsId = generateSendungsId();
//     const zustellpartnerId = String(Math.floor(Math.random() * 900) + 100); // Random 3-digit number
//     return {
//       id: (index + 1).toString(),
//       sidDVS: sendungsId,
//       sidZup: sendungsId,
//       dmc: `DVSC${sendungsId}23456${zustellpartnerId}1${String(
//         Math.floor(Math.random() * 90) + 10
//       )}`,
//       gam: getRandomDate(),
//       status: "VALID",
//       erfasser: "4202",
//       zust: zustellpartnerId,
//     };
//   });
// };

// Generate 5000 test entries
// export const codes: Code[] = generateTestData(5000);
export const codes: Code[] = [];
