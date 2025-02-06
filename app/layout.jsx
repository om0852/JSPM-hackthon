import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Toaster } from 'react-hot-toast';



export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
} 