import { Code } from "@/types/types";

export const exportToCSV = async (
  data: Code[],
  setData: (value: React.SetStateAction<Code[]>) => void
) => {
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
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // 5. The user ACCEPTED and completed saving the file
    console.log('User ACCEPTED. File saved.');
    // ... at this point, you're sure the file was actually saved.
    // If you want to clear data now, you can do it safely:
    localStorage.removeItem('sc-scan-data');
    setData([]);

  } catch (err) {
    // If the user CANCELS the save dialog, it throws an AbortError
        console.log('User CANCELED:', err);
  }
};
