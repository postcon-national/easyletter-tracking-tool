import { Code } from "@/types/types";

export const checkDuplicateCodes = (isDataLoaded: boolean, data: Code[], scannedData: string) => {
    {
        // Force access to latest data state
        const currentData = data;
        if (!isDataLoaded) {
            return false;
        }
    
        // Check if the input string contains multiple 'DVS' occurrences
        const dvsCount = (scannedData.match(/DVS/g) || []).length;
        if (dvsCount > 1) {
            return true; // Multiple codes found, consider it a duplicate
        }
    
        // Then check if the single code exists in our data
        return currentData.some(item => item.dmc === scannedData.trim());
      }
}