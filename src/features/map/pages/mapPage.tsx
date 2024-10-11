'use client';
import React, { useState, useEffect } from 'react';
import { postDataByPostTypeAndUpdatedAt } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from './../../../aws-exports';
import dynamic from 'next/dynamic';
import { getCurrentUser } from 'aws-amplify/auth'; // ユーザー情報取得のためのインポート
const MapComponent = dynamic(() => import('../components/mapComponent'), { ssr: false });
import CategoryDropdown from '@/shared/utils/category/categorydownMenu';
import { categoriesList } from '@/shared/utils/category/categoryList';
import { getUrl } from 'aws-amplify/storage';
import { listLikes } from '../../../graphql/queries'; // いいねのリストを取得

Amplify.configure(awsExports);

const client = generateClient();

interface Post {
  id: string;
  imageUrl?: string | null;
  userId: string;
  lat: number;
  lng: number;
  category: string;
  comment: string;
  reported: boolean;
  deleted: boolean;
  visible: boolean;
  point: number;
  postType: string;
  postedby?: string | null;
  likes?: number;  // いいね数を追加
}

const PostMapPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加
  const [isMoreAvailable, setIsMoreAvailable] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // ユーザーID用のステート

  useEffect(() => {
    fetchPostData(null, true);
  }, [selectedCategory]);

  useEffect(() => {
    getUserLocation();
    fetchUserId(); // ユーザーIDを取得
  }, []);

  // ユーザーのIDを取得する関数
  const fetchUserId = async () => {
    try {
      const user = await getCurrentUser();
      setUserId(user?.username ?? null); // ユーザーIDをセット
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

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
          reported: { eq: false },
        },
      };
    } else {
      variables = {
        postType: 'POST',
        filter: {
          deleted: { eq: false },
          reported: { eq: false },
          category: { eq: selectedCategory },
        },
      };
    }

    try {
      const apiData = await client.graphql({
        query: postDataByPostTypeAndUpdatedAt,
        variables: variables,
      });

      const postsFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.items;
      const nextTokenFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.nextToken;

      // いいね数の取得処理を追加
      await Promise.all(
        postsFromAPI.map(async (post: Post) => {
          if (post.imageUrl) {
            const url = await getUrl({ key: post.imageUrl });
            post.imageUrl = url.url.toString();
          }
          
          // いいねデータを取得 (listLikesまたはgetLikeを使用)
          const likesData = await client.graphql({
            query: listLikes,
            variables: { filter: { postId: { eq: post.id } } },
          });
          post.likes = likesData.data.listLikes.items.length;  // いいね数をセット
          
          return post;
        })
      );

      setPosts((prevPosts) => (isInitialLoad ? postsFromAPI : [...prevPosts, ...postsFromAPI]));
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
        userPosition && userId && (
          <MapComponent 
            userPosition={userPosition} 
            posts={posts} 
            userId={userId} // ここでuserIdを渡す
          />
        )
      )}
    </div>
  );
};

export default PostMapPage;
