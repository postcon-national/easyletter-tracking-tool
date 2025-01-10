import { Code } from "@/types/types";

export const exportToCSV = async (
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
  // 1. If the File System Access API is not available, fallback to <a download>.
  if (!('showSaveFilePicker' in window)) {
    // Fallback to your existing <a download> code here:
    fallbackExport(data); 
    return;
  }

  try {
    // 2. Convert your data to CSV (client-side or from your /api/export-csv).
    const response = await fetch('/api/export-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const timestamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15);
    const suggestedName = `${timestamp}_Trackingdaten_dvs.csv`;

    debugger
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: 'CSV files',
          accept: {
            'text/csv': ['.csv'],
          },
        },
      ],
    });

    // 4. Write to the selected file
    const writable = await fileHandle.createWritable();
    await writable.write(csvText);
    await writable.close();

    // If you want to clear data now, you can do it safely:
    localStorage.removeItem('sc-scan-data');
    setData([]);

  } catch (err: any) {
    // If the user CANCELS the save dialog, it throws an AbortError
    if (err.name === 'AbortError') {
      console.log('User CANCELED the save dialog. Data was NOT cleared.');
      // Do NOT clear data, or handle as you like.
    } else {
      console.error('An error occurred while saving:', err);
    }
  }
};

// Fallback if the browser does NOT support File System Access API
function fallbackExport(data: Code[]) {
  try {
    // Convert the data to Blob or fetch from /api/export-csv
    // Then create the <a download> link as before, but you CANNOT detect accept/cancel here.
    console.warn('Using fallback <a download>; cannot detect accept/cancel.');
    // ...
  } catch (error) {
    console.error('Export failed:', error);
  }
}
