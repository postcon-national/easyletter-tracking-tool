import { Code } from "@/types/types";
import moment from "moment";

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
    gam: moment(new Date().toISOString()).format("YYYY-MM-DD HH:mm:ss"),
    status: "VALID",
    erfasser: "4202",
    zust: zustellpartnerId,
  };
  setData((prevData) => [...prevData, newEntry]);
};
