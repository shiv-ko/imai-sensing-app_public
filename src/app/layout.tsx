import './globals.css';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
Amplify.configure(awsExports);

export const metadata = {
  title: 'Amplify Auth with App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <body>{children}</body>
      
    </html>
  );
}