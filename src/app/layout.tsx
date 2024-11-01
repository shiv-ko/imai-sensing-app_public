import './globals.css';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { PostProvider } from '@/shared/contexts/PostContext';
Amplify.configure(awsExports);

export const metadata = {
  title: 'I-MY-GO',
  description: 'This is I-MY-GO.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <PostProvider>
          {children}
        </PostProvider>
      </body>
    </html>
  );
}