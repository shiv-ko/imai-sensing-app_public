// pages/post/index.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { createPostData } from '../../../graphql/mutations';
import { uploadData } from 'aws-amplify/storage';
import {fetchUserAttributes} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsExports from '../../../aws-exports';
import PostForm from '../components/postForm';
import imageCompression from '../../../shared/utils/image/compressImage'; 
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { capturedImageAtom } from '../states/imageAtom';
import updateUserScore from '@/hooks/updatePoint';

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
function getFormattedTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるので+1
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
}



const PostPage: React.FC = () => {
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme');
  const router = useRouter();

  const capturedImage = useRecoilValue(capturedImageAtom);

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
    point: 1,
    postType: 'POST',
    likes:0,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nickName,setNickName]=useState<string>();
  const [userid,setUserid]=useState<string>();

  //ユーザの位置情報と認証情報を取得
  useEffect(() => {
    getUserLocation();
    const fetchData = async () => {
      await handleFetchUserAttributes();
    };
    fetchData();
  }, []);

  // テーマと画像を設定
  useEffect(() => {
    if (theme && typeof theme === 'string') {
      setFormData((prevData) => ({
        ...prevData,
        category: theme,
        postType: theme === '自治会に伝えたいこと' ? 'INVISIBLE' : 'POST',
      }));
    }

    if (capturedImage) {
      // 画像を圧縮してformDataに設定
      compressImage(capturedImage)
        .then((compressedFile) => {
          setFormData((prevData) => ({
            ...prevData,
            image: compressedFile,
          }));
        })
        .catch((error) => {
          console.error('Error compressing image:', error);
        });
    } else {
      // 画像がない場合はカメラページに戻す
      alert('画像がありません。もう一度撮影してください。');
      router.push(`/camera?theme=${theme}`);
    }
  }, [theme, capturedImage]);

  //ユーザの属性を取得する関数
  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      setNickName(userAttributes.nickname);
      //console.log('userAttributes:',userAttributes);
      //console.log('userNickName',userAttributes.nickname);
      setUserid(userAttributes.sub)
    } catch (error) {
      //console.log(error);
    }
  }

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

    try {
      // Ensure userid is available
      if (!userid) {
        console.error('User ID is not available.');
        return;
      }

      // 詳細なタイムスタンプを取得
      const timestamp = getFormattedTimestamp();
      const uniqueString = `${userid}+${timestamp}`;
      const imageName = uniqueString;

      // Create new File object with new name
      if (formData.image) {
        const image = formData.image;
        const newImageFile = new File([image], imageName, { type: image.type });
        // Update formData.image
        setFormData(prevData => ({
          ...prevData,
          image: newImageFile
        }));
      }
      try {
        // 現在のユーザーを取得
        const userAttributes = await fetchUserAttributes();
        const userId = userAttributes.sub;

        // スコアを更新
        await updateUserScore(userId || '', 1);
        //console.log('ユーザーのスコアが更新されました:', updatedUser.score);
      } catch (err) {
        console.error('スコアの更新中にエラーが発生しました:', err);
      } 
      


      // Extract form data
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

      // Prepare post data
      const postData = {
        userId: userid || '',
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        category,
        comment,
        reported,
        deleted,
        visible,
        point,
        postType,
        imageUrl: imageName,
        postedby: nickName,
      };

      // Upload image with new name
      if (image) {
        await uploadData({ key: imageName, data: image });
      }

      // Save post data to the database
      await client.graphql({
        query: createPostData,
        variables: { input: { ...postData, postedby: postData.postedby || '' } },
      });

      // Reset form data
      setFormData({
        ...formData,
        comment: '',
        image: null,
      });
    } catch (error) {
      console.error('Error while creating post:', error);
    } finally {
      // Navigate to the completion page
      router.push('/camera/completion');
    }
  }



  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div style={styles.container}>
      
      {loadingLocation ? (
        <p>位置情報を取得中...</p>
      ) : (
        <PostForm
        formData={formData}
        handleInputChange={handleInputChange}
        createPost={createPost}
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
