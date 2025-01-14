import { Code } from "@/types/types";

export const exportToCSV = async (
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
  try {
    // Upload via SFTP endpoint
    const response = await fetch("/api/upload-sftp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("File uploaded successfully:", result.filename);

    // Clear local storage and data after successful upload
    localStorage.removeItem("easyletter-tracking-tool-data");
    setData([]);

    return result;
  } catch (err) {
    console.error("Export failed:", err);
    throw err;
  }
};
