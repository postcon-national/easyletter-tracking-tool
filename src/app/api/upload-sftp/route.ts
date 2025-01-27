import { sftpPaths } from "@/constants/constants";
import { NextResponse } from "next/server";
import { Client } from "ssh2";

const SFTP_CONFIG = {
  host: process.env.SFTP_HOST,
  port: parseInt(process.env.SFTP_PORT || "22"),
  username: process.env.SFTP_USERNAME,
  password: process.env.SFTP_PASSWORD,
  readyTimeout: 10000, // 10 seconds timeout
};

export async function POST(request: Request) {
  try {
    const { content, filename } = await request.json();

    // Upload via SFTP
    await new Promise<void>((resolve, reject) => {
      const conn = new Client();

      // Add connection event handlers
      conn.on("error", (err) => {
        console.error("SFTP: Connection error:", err);
        reject(err);
      });

      conn.on("ready", () => {
        conn.sftp((err: Error | undefined, sftp) => {
          if (err) {
            console.error("SFTP: Failed to create SFTP session:", err);
            reject(err);
            conn.end();
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

            
            console.log(process.env.NEXT_PUBLIC_NODE_ENV, "NEXT_PUBLIC_NODE_ENV")
            console.log(process.env.NODE_ENV, "NODE_ENV")
            const sftpPath = sftpPaths[process.env.NODE_ENV];
            console.log(sftpPath, "sftpPath")
            const writeStream = sftp.createWriteStream(`${sftpPath}/${filename}`);

            writeStream.on("close", () => {
              conn.end();
              resolve();
            });

            writeStream.on("error", (err: Error) => {
              console.error("SFTP: Write stream error:", err);
              conn.end();
              reject(err);
            });

            // Write the content and end the stream
            writeStream.write(content, (err) => {
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

      // Connect
      try {
        conn.connect(SFTP_CONFIG);
      } catch (err) {
        console.error("SFTP: Connection attempt error:", err);
        reject(err);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SFTP upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
