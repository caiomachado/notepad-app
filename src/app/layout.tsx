import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/sonner';

const roboto = Roboto({ weight: ["100", "300", "400", "500", "700", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notepad App",
  description: "An app where you can collaborate with people to write up notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={`${roboto.className} antialiased`}>
          <Header />

          <main className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </div>

            <Toaster position="top-center" />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
