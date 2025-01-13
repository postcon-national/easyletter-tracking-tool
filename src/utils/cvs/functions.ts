import { Code } from "@/types/types";

export const exportToCSV = async (
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
  try {
    // 2. Convert your data to CSV (client-side or from your /api/export-csv).
    const response = await fetch("/api/export-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // For demonstration, read it back as text (or you could read as Blob, then convert to text).
    const csvText = await response.text();

    // 3. Prompt the user with the Save File Picker.
    //    If they cancel, this throws an AbortError.
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const suggestedName = `${timestamp}_Trackingdaten_dvs.csv`;

    const hasFileSystemAccess = "showSaveFilePicker" in window;

    if (!hasFileSystemAccess) {
      fallbackDownload(new Blob([csvText]), setData);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: "CSV files",
          accept: {
            "text/csv": [".csv"],
          },
        },
      ],
    });

    // 4. Write to the selected file
    const writable = await fileHandle.createWritable();
    await writable.write(csvText);
    await writable.close();

    // 5. The user ACCEPTED and completed saving the file
    console.log("User ACCEPTED. File saved.");
    // ... at this point, you're sure the file was actually saved.
    // If you want to clear data now, you can do it safely:
    localStorage.removeItem("easyletter-tracking-tool-data");
    setData([]);
  } catch (err) {
    // If the user CANCELS the save dialog, it throws an AbortError
    console.log("User CANCELED:", err);
  }
};

async function fallbackDownload(
  csvBlob: Blob,
  setData: (value: React.SetStateAction<Code[]>) => void
) {
  try {
    // Create a temporary Blob URL
    const url = URL.createObjectURL(csvBlob);

    // Generate a filename with current date/time
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const filename = `${timestamp}_Trackingdaten_dvs.csv`;

    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    localStorage.removeItem("easyletter-tracking-tool-data");
    setData([]);
  } catch (err) {
    console.error("Fallback download failed:", err);
  }
}
