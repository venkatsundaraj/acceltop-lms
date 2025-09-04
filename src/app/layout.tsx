import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";

const heading = Poppins({
  variable: "--font-heading",
  weight: ["300", "400", "500", "700", "800"],
});

const paragraph = Poppins({
  variable: "--font-paragraph",
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Acceltop LMS",
  description: "E-Marketplace for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${paragraph.variable} antialiased`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
