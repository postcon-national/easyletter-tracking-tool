import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SC-Scan | DVS",
  description: "Sortierzentrum Eingangsscan - Deutscher Versand Service",
  icons: {
    icon: "https://www.deutscherversandservice.de/favicon.ico",
    shortcut: "https://www.deutscherversandservice.de/favicon.ico",
    apple: "https://www.deutscherversandservice.de/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          type="image/x-icon" 
          href="https://www.deutscherversandservice.de/favicon.ico"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
