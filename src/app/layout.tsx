import './globals.css';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
Amplify.configure(awsExports);

export const metadata = {
  title: 'I-MY-GO',
  description: 'This is I-MY-GO.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" href="/favicon.ico?v=2" />
      </head>
      
      <body>{children}</body>
      
    </html>
  );
}