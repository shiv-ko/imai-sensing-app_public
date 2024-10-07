//TODO: 画像ファイルだけを投稿できるようにする。
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
  const searchParams = useSearchParams();  // useSearchParamsを使用
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
  const [loadingLocation, setLoadingLocation] = useState(false);  // 位置情報取得中かどうか
  const [user, setUser] = useState<GetCurrentUserOutput>();

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

  // ユーザーの位置情報を取得する関数
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
          setLoadingLocation(false);  // 位置情報取得完了
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

  // 新しい投稿を作成する関数
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
      await client.graphql({
        query: createPostData,
        variables: { input: postData },
      });

      if (image) {
        await uploadData({ key: image.name, data: image });
      }

      // フォームデータをリセット（位置情報とカテゴリは保持）
      setFormData({
        ...formData,
        comment: '',
        image: null,
      });
      router.push('/camera');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  // フォームの入力を処理する関数
  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  // 画像選択時に圧縮処理を実行
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
    <div>
      <h1>投稿ページ</h1>
      {/* 位置情報を取得中の場合はメッセージを表示 */}
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

export default withAuthenticator(PostPage);
