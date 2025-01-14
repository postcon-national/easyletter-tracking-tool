import { NextResponse } from "next/server";
import { Client } from "ssh2";
import { Code } from "@/types/types";

const SFTP_CONFIG = {
  host: process.env.SFTP_HOST,
  port: parseInt(process.env.SFTP_PORT || "22"),
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
};

const generateCSV = (data: Code[]) => {
  const headers = [
    "sidDVS",
    "sidZup",
    "dmc",
    "gam",
    "erfasser",
    "status",
    "zust",
  ];
  const csvRows = [headers.join(";")];

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header as keyof Code];
      return value ? `"${value}"` : "";
    });
    csvRows.push(values.join(";"));
  });

  return csvRows.join("\n");
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const csvContent = generateCSV(data);

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 15);
    const filename = `${timestamp}_Trackingdaten_dvs.csv`;

    // Upload via SFTP
    await new Promise<void>((resolve, reject) => {
      const conn = new Client();

      // Add connection event handlers
      conn.on("ready", () => {
        console.log("SFTP: Connection established");
        conn.sftp((err: Error | undefined, sftp) => {
          if (err) {
            console.error("SFTP: Failed to create SFTP session:", err);
            reject(err);
            return;
          }

          // First check if in directory exists
          sftp.stat("/in", (statErr) => {
            if (statErr) {
              console.error("SFTP: 'in' directory does not exist:", statErr);
              reject(new Error("'in' directory does not exist"));
              conn.end();
              return;
            }

            const writeStream = sftp.createWriteStream(`/in/${filename}`);

            writeStream.on("close", () => {
              console.log("SFTP: File uploaded successfully");
              conn.end();
              resolve();
            });

            writeStream.on("error", (err: Error) => {
              console.error("SFTP: Write stream error:", err);
              conn.end();
              reject(err);
            });

            writeStream.write(csvContent, (err) => {
              if (err) {
                console.error("SFTP: Write error:", err);
                reject(err);
                return;
              }
              writeStream.end();
            });
          });
        });
      });

      conn.on("error", (err: Error) => {
        console.error("SFTP: Connection error:", err);
        reject(err);
      });

      conn.on("end", () => {
        console.log("SFTP: Connection ended");
      });

      console.log("SFTP: Attempting connection with config:", {
        host: SFTP_CONFIG.host,
        port: SFTP_CONFIG.port,
        username: SFTP_CONFIG.username,
        // Mask password for security
        password: SFTP_CONFIG.password ? "********" : undefined,
      });

      conn.connect(SFTP_CONFIG);
    });

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("SFTP upload error:", error);
    // Return more detailed error message
    return NextResponse.json(
      {
        error: "Failed to upload file via SFTP",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
