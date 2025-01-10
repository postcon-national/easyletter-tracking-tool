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
      quote: '"',
      withBOM: true, // Add BOM for UTF-8 encoding
    };

    const csv = parse(data, opts);

    // Construct the file response
    return new NextResponse(csv, {
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

