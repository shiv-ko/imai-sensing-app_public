'use client'
import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { createPostData } from '../../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, GetCurrentUserOutput } from 'aws-amplify/auth';
import awsExports from '../../../aws-exports';
import PostForm from '../components/postForm';
import imageCompression from '../../../shared/utils/image/compressImage'; 
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

Amplify.configure(awsExports);

const client = generateClient();

// 画像圧縮関数
async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing the image:', error);
    throw error;
  }
}

const PostPage: React.FC = () => {
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme');
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: '',
    lat: '',
    lng: '',
    category: '',
    comment: '',
    image: null as File | null,
    reported: false,
    deleted: false,
    visible: true,
    point: 0,
    postType: 'POST',
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [user, setUser] = useState<GetCurrentUserOutput>();

  //ユーザの位置情報と認証情報を取得
  useEffect(() => {
    getUserLocation();
    getCurrentUserAsync();
  }, []);

  useEffect(() => {
    if (theme && typeof theme === 'string') {
      setFormData((prevData) => ({
        ...prevData,
        category: theme,
      }));
    }
  }, [theme]);

  //ユーザの認証情報を取得する関数
  const getCurrentUserAsync = async () => {
    const result = await getCurrentUser();
    setUser(result);
  };

  //ユーザの位置情報を取得する関数
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          }));
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error obtaining geolocation', error);
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  async function createPost(event: React.FormEvent) {
    event.preventDefault();

    const {
      lat,
      lng,
      category,
      comment,
      image,
      reported,
      deleted,
      visible,
      point,
      postType,
    } = formData;

    const postData = {
      userId: user?.userId ?? '',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      category,
      comment,
      reported,
      deleted,
      visible,
      point,
      postType,
      imageUrl: image?.name ?? null,
    };

    try {
      //データをDBに保存。
      await client.graphql({
        query: createPostData,
        variables: { input: postData },
      });

      //画像があったら別でS3に保存
      if (image) {
        await uploadData({ key: image.name, data: image });
      }

      setFormData({
        ...formData,
        comment: '',
        image: null,
      });
      //投稿完了したら前のテーマ選択のページに戻る。(連続で投稿ができないため)
      router.push('/camera');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function setImage(file: File | null) {
    if (file) {
      compressImage(file)
        .then((compressedFile) => {
          setFormData({ ...formData, image: compressedFile });
        })
        .catch((error) => {
          console.error('Error compressing image:', error);
        });
    } else {
      setFormData({ ...formData, image: null });
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>投稿ページ</h1>
      {loadingLocation ? (
        <p>位置情報を取得中...</p>
      ) : (
        <PostForm
          formData={formData}
          handleInputChange={handleInputChange}
          createPost={createPost}
          setImage={setImage}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
};

export default withAuthenticator(PostPage);
