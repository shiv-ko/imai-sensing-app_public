'use client';
import React, { useState, useEffect } from 'react';
import { postDataByPostTypeAndUpdatedAt } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from './../../../aws-exports';
import MapComponent from '../components/mapComponent';
import CategoryDropdown from '@/shared/utils/category/categorydownMenu';
import { categoriesList } from '@/shared/utils/category/categoryList';
import { getUrl } from 'aws-amplify/storage';
import { Post } from '../types/post';  // Post型をインポート

Amplify.configure(awsExports);

const client = generateClient();

const PostMapPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加
  const [isMoreAvailable, setIsMoreAvailable] = useState<boolean>(true);

  useEffect(() => {
    fetchPostData(null, true);
  }, [selectedCategory]);

  useEffect(() => {
    getUserLocation();
  }, []);

  // ユーザーの位置情報を取得する関数
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserPosition([lat, lng]);
          setLoading(false); // 位置情報が取得できたらローディングを解除
        },
        (error) => {
          console.error('Error obtaining geolocation', error);
          setUserPosition([35.6895, 139.6917]); // デフォルト位置
          setLoading(false); // 位置情報が取得できなくてもローディングを解除
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setUserPosition([35.6895, 139.6917]); // デフォルト位置
      setLoading(false); // 位置情報がサポートされていない場合もローディングを解除
    }
  };

  // カテゴリ変更時のハンドラー
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPosts([]);
    setIsMoreAvailable(true);
  };

  async function fetchPostData(token: string | null, isInitialLoad: boolean = false) {
    if (!isMoreAvailable && !isInitialLoad) return;

    let variables;
    if (selectedCategory === 'All') {
      variables = {
        postType: 'POST',
        filter: {
          deleted: { eq: false },
        },
      };
    } else {
      variables = {
        postType: 'POST',
        filter: {
          deleted: { eq: false },
          category: { eq: selectedCategory },
        },
      };
    }

    try {
      const apiData = await client.graphql({
        query: postDataByPostTypeAndUpdatedAt,
        variables: variables,
      });

      // 型アサーションを使用して postsFromAPI を Post[] として扱う
      const postsFromAPI: Post[] = apiData.data.postDataByPostTypeAndUpdatedAt.items as Post[];

      // nextTokenFromAPI を string | null に明示的に変換
      const nextTokenFromAPI: string | null = apiData.data.postDataByPostTypeAndUpdatedAt.nextToken ?? null;

      // 画像URLの取得処理
      const transformedPosts: Post[] = await Promise.all(
        postsFromAPI.map(async (post: Post) => {
          if (post.imageUrl) {
            const url = await getUrl({ key: post.imageUrl });
            post.imageUrl = url.url.toString();
          }
          return post;
        })
      );

      setPosts((prevPosts) => (isInitialLoad ? transformedPosts : [...prevPosts, ...transformedPosts]));
      setIsMoreAvailable(!!nextTokenFromAPI);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  const allCategories = categoriesList.includes('All')
    ? categoriesList
    : ['All', ...categoriesList];

  return (
    <div>
      <h2>マップビュー</h2>
      <CategoryDropdown
        selectedCategory={selectedCategory}
        categories={allCategories}
        onCategoryChange={handleCategoryChange}
      />
      {loading ? (
        <p>ロード中...</p> // 位置情報の読み込みが完了するまで表示
      ) : (
        userPosition && <MapComponent userPosition={userPosition} posts={posts} />
      )}
    </div>
  );
};

export default PostMapPage;
