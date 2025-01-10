import { Code } from "@/types/types";

export const exportToCSV = async (data: Code[], setData: (value: React.SetStateAction<Code[]>) => void) => {
    try {
      // 1. Send the data to our API route
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 2. Convert the response to a Blob
      const blob = await response.blob();

      // 3. Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // 4. Create a temporary <a> element to trigger the download
      const link = document.createElement('a');
      link.href = url;
       // Generate the filename with the current date and time
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15); // YYYYMMDDhhmmss
      const filename = `${timestamp}_Trackingdaten_dvs.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup the link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // 5. Clear the exported data from local state
      setData([]);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };