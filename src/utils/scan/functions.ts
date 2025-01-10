import { Code } from "@/types/types";

export const scan = (
  scannedData: string,
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
  const zustellpartnerId = scannedData.slice(25, 28);
  const newEntry: Code = {
    id: (data.length + 1).toString(),
    sidDVS: scannedData.slice(4, 20),
    sidZup: scannedData.slice(4, 20),
    dmc: scannedData,
    gam: new Date().toISOString(),
    status: "VALID",
    erfasser: "4202",
    zust: zustellpartnerId,
  };
  setData((prevData) => [...prevData, newEntry]);
};
