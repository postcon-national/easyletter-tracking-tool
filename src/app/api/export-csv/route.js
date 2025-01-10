import { NextResponse } from 'next/server';
import { parse } from 'json2csv';

export async function POST(req) {
  try {
    const data = await req.json();

    // Define the mapping from JSON fields to CSV columns
    const fields = [
      { label: 'UPOC_ZUP', value: 'sidZup' },           // sidZup -> UPOC_ZUP
      { label: 'SendungsID_dvs', value: 'sidDVS' },     // sidDVS -> SendungsID_dvs
      { label: 'DATAMATRIX_dvs', value: 'dmc' },        // dmc -> DATAMATRIX_dvs
      { label: 'EncodingDateTime', value: 'gam' },      // gam -> EncodingDateTime
      { label: 'shortStatus', value: 'status' },        // status -> shortStatus
      { label: 'ZUPID_Erfasser', value: 'erfasser' },   // erfasser -> ZUPID_Erfasser
      { label: 'ZUPID_Zusteller', value: 'zust' },      // zust -> ZUPID_Zusteller
    ];

    const opts = {
      fields,
      delimiter: ';',
      quote: '',
      withBOM: true, // Add BOM for UTF-8 encoding
    };

    const csv = parse(data, opts);
    const result = transformCSV(csv);

    // Construct the file response
    return new NextResponse(result, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="export.csv"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

function transformCSV(str) {
    // Split entire CSV by newline into lines
    const lines = str.split(/\r?\n/);
  
    // 1) Extract and transform HEADER (first line)
    // Remove all quotes
    const header = lines[0].replace(/"/g, '');
  
    // 2) Transform each DATA row
    //    - Remove all quotes from columns
    //    - Re-quote columns 4, 5, 6
    const dataRows = lines.slice(1).map((line) => {
      // Ignore empty lines (in case there's a trailing newline)
      if (!line.trim()) return '';
  
      // Split by semicolon
      const cols = line.split(';').map((c) => c.replace(/"/g, ''));
  
      // Re-quote shortStatus, ZUPID_Erfasser, ZUPID_Zusteller 
      // (these are columns at indexes 4, 5, 6)
      cols[4] = `"${cols[4]}"`;
      cols[5] = `"${cols[5]}"`;
      cols[6] = `"${cols[6]}"`;
  
      return cols.join(';');
    });
  
    // Combine everything: header + the transformed rows
    // Filter out any empty rows (if the last line was empty)
    const finalRows = [header, ...dataRows.filter((row) => row !== '')];
  
    // Join the rows back with newlines
    return finalRows.join('\n');
  }

