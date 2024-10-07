'use client'
import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { createPostData } from '../../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../aws-exports';
import PostForm from '../components/postForm';


Amplify.configure(awsExports);

const client = generateClient();

const PostPage: React.FC = () => {
  
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
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'Nature',
    'Technology',
    'Art',
    'Science',
    'History',
  ]);

  useEffect(() => {
    getUserLocation();
  }, []);

  // 新しいカテゴリを追加する関数
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory(''); // 入力欄をリセット
    }
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

  // 新しい投稿を作成する関数
  async function createPost(event: React.FormEvent) {
    event.preventDefault();
    const {
      userId,
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
      userId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      category,
      comment,
      reported,
      deleted,
      visible,
      point,
      postType,
      imageUrl: image?.name ? image.name : null,
    };

    try {
      await client.graphql({
        query: createPostData,
        variables: { input: postData },
      });

      if (image) {
        await uploadData({ key: image.name, data: image });
      }


      // フォームデータをリセット
      setFormData({
        userId: '',
        lat: '',
        lng: '',
        category: '',
        comment: '',
        image: null,
        reported: false,
        deleted: false,
        visible: true,
        point: 0,
        postType: 'POST',
      });
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

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, category: event.target.value });
  }

  function setImage(file: File | null) {
    setFormData({ ...formData, image: file });
  }

  return (
    <div>
      <h1>投稿ページ</h1>
      <PostForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleCategoryChange={handleCategoryChange}
        createPost={createPost}
        categories={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        addCategory={addCategory}
        loadingLocation={loadingLocation}
        setImage={setImage}
      />
    </div>
  );
};

export default withAuthenticator(PostPage);
