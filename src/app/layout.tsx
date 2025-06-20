import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bracket | Simulasi Liga",
  description: "Aplikasi simulasi liga dengan jadwal pertandingan dan klasemen otomatis.",
  keywords: ["League Scenario", "Liga", "Simulasi Liga", "Pertandingan", "Jadwal Bola"],
  authors: [{ name: "Misbahul Rafi", url: "https://bracket-eight.vercel.app" }],
  creator: "Bracket Team",
  metadataBase: new URL("https://bracket-eight.vercel.app"),
  robots: "index, follow",
  openGraph: {
    title: "Bracket | Simulasi Liga",
    description: "Buat dan kelola liga olahraga dengan jadwal otomatis.",
    url: "https://bracket-eight.vercel.app",
    siteName: "Bracket",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Simulasi Liga Bracket",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bracket | Simulasi Liga",
    description: "Aplikasi untuk membuat simulasi liga dan klasemen otomatis.",
    images: ["/og-image.png"],
    creator: "@skaltere_xu",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
