import { SCAN_DUPLICATE_MESSAGE } from "@/constants/constants";
import { Code } from "@/types/types";

const formatDateTime = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export const scan = (
  scannedData: string,
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
  const zustellpartnerId = scannedData.slice(25, 28);
  const abladestellenId = scannedData[28];
  const newEntry: Code = {
    id: (data.length + 1).toString(),
    sidDVS: scannedData.slice(4, 20),
    sidZup: scannedData.slice(4, 20),
    dmc: scannedData,
    gam: formatDateTime(new Date()),
    status: "VALID",
    erfasser: "4202",
    zust: zustellpartnerId + abladestellenId,
  };
  setData((prevData) => [...prevData, newEntry]);
};

export const handleScanAction = (scannedData: string, data: Code[], setData: (value: React.SetStateAction<Code[]>) => void, setScannerMessage: (value: string | null) => void) => {
  const trimmedData = scannedData.trim();
  const exists = data.some(item => item.dmc === trimmedData);

  if (!exists) {
    scan(trimmedData, data, setData);
    setScannerMessage(null);
  } else {
    setScannerMessage(SCAN_DUPLICATE_MESSAGE);
  }
}