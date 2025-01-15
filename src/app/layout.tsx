import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Main from "@/components/Main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easyletter Tracking Tool | DVS",
  description: "Easyletter Tracking Tool - Deutscher Versand Service",
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
        <div className="min-h-screen bg-[var(--dvs-gray-light)] relative">
          <div className="absolute inset-0 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-white via-[var(--dvs-gray-light)] to-[var(--dvs-gray-light)] opacity-40" />
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(var(--dvs-orange) 0.5px, transparent 0.5px), radial-gradient(var(--dvs-orange) 0.5px, var(--dvs-gray-light) 0.5px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            opacity: 0.05
          }} />
            <div className="relative">
            <Header />
              <Main>
               {children}
              </Main>
            </div>
        </div>
      </body>
    </html>
  );
}
