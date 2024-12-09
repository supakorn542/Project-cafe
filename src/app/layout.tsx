import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./context/authContext"
import { Playfair_Display, Source_Serif_4, Gloock } from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "800"], 
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
});

const gloock = Gloock({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Forest Tales",
  description: "Cafe Management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.className} ${sourceSerif4.className}  antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        
      </body>
    </html>
  );
}
