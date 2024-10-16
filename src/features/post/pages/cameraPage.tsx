// pages/camera/index.tsx
'use client'; // クライアントコンポーネントであることを明示

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { capturedImageAtom } from '../states/imageAtom';
import { useSearchParams } from 'next/navigation';
import { background } from '@chakra-ui/react';

const CameraPage: React.FC = () => {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useRecoilState(capturedImageAtom);
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme') || '';

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // カメラを起動
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        alert('カメラにアクセスできませんでした。');
        router.back();
      });
  }, [router]);

  const takePhoto = () => {
    if (videoRef.current) {
      console.log(capturedImage);
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            // タイムスタンプとランダムなハッシュ値を組み合わせて一意のファイル名を生成
            const timestamp = Date.now();
            const randomHash = Math.random().toString(36).substring(2, 15);
            const fileName = `${timestamp}_${randomHash}.jpg`;

            const file = new File([blob], fileName, { type: 'image/jpeg' });
            setCapturedImage(file);

            // テーマをクエリパラメータとして渡してPostPageに遷移
            const params = new URLSearchParams({ theme });
            router.push(`/camera/post?${params.toString()}`);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <div style={styles.content}>
      <div style={styles.card}>
        <video ref={videoRef} autoPlay playsInline style={styles.camera} />
      </div>
      <button onClick={takePhoto} style={styles.button}>
        撮影
      </button>
    </div>
  );
};

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '60%',
    borderRadius: '10px',
  },
  camera: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CameraPage;