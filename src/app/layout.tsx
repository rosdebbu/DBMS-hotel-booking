import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'GoAnywhere — Hotel Booking Platform',
  description: "India's smartest hotel booking platform. Find and book hotels at the best prices across India. Powered by advanced DBMS with real-time availability.",
  keywords: ['hotel booking', 'India hotels', 'GoAnywhere', 'DBMS project', 'MySQL'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <div className="min-h-screen bg-[#0a0e1a] bg-mesh grain flex flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <Chatbot />
        </div>
      </body>
    </html>
  );
}
