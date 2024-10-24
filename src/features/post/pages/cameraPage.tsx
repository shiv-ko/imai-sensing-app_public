'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { capturedImageAtom } from '../states/imageAtom';
import { useSearchParams } from 'next/navigation';

const CameraPage: React.FC = () => {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useRecoilState(capturedImageAtom);
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') || '';

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Programmatically click the input to open the camera
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setCapturedImage(file);
      console.log(capturedImage);

      // Navigate to post page with theme as query parameter
      const params = new URLSearchParams({ theme });
      router.push(`/camera/post?${params.toString()}`);
    } else {
      // If no file is selected, navigate back
      router.back();
    }
  };

  return (
    <div style={styles.content}>
      <h2 style={styles.themeTitle}>お題: {theme}</h2>
      <div style={styles.card}>
        <input
          ref={inputRef}
          id="upload"
          type="file"
          name="image"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box' as const,
    paddingTop: '-3rem',
    overflow: 'hidden',
  },
  themeTitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60vh',
    borderRadius: '10px',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
};

export default CameraPage;
