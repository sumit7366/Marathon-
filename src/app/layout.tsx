import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "BareillyRunners | Marathon Events in Bareilly",
  description: "Join the biggest marathon events in Bareilly. Register for 5K, 10K, and 21K runs. BareillyRunners — Run for Fitness, Run for Fun!",
  keywords: "marathon, bareilly, running, 5k, 10k, 21k, half marathon, bareilly runners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
