import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'BookShelf — Book Management System',
    template: '%s | BookShelf',
  },
  description:
    'A professional book management system to organize your library, manage categories, and browse your collection.',
  keywords: ['books', 'library', 'book management', 'catalog'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
