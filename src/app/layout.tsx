import type { Metadata } from 'next';
import './globals.css';
import { AnalyticsProvider } from '../contexts/AnalyticsProvider';
import { PopunderAd } from '../components/PopunderAd';

export const metadata: Metadata = {
  title: 'TharkiBazaar',
  description: 'Blurred previews, Terabox drops, and high-impact monetisation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased">
        <AnalyticsProvider>
          <PopunderAd>{children}</PopunderAd>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
