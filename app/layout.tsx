import { ClerkProvider } from '@clerk/nextjs';
import ErrorBoundary from './components/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>

        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
} 