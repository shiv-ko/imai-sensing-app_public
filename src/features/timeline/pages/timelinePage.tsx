import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { postDataByPostTypeAndUpdatedAt } from '../../../graphql/queries'; // カテゴリでフィルタリングできるクエリをインポー
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import PostItem from '../components/postItem';  
import awsExports from '../../../aws-exports';
import CategoryDropdown from '@/shared/utils/category/categorydownMenu';
import { categoriesList } from '@/shared/utils/category/categoryList';

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
}

const TimelinePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // 初期値を"All"に設定
  const [nextToken, setNextToken] = useState<string | null>(null); // 次のページ用のトークン
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態
  const [isMoreAvailable, setIsMoreAvailable] = useState<boolean>(true); // 追加データの有無

  useEffect(() => {
    // カテゴリが変更されたら初期化して再取得
    resetAndFetchPostData();
  }, [selectedCategory]); // カテゴリが変更されたらデータを再取得

  // カテゴリ変更時に初期化して再取得
  const resetAndFetchPostData = () => {
    setPosts([]); // 投稿をリセット
    setNextToken(null); // 次のトークンをリセット
    setIsMoreAvailable(true); // 追加データの有無をリセット
    fetchPostData(null, true); // 初期データを取得
  };

  // データ取得関数
  async function fetchPostData(token: string | null, isInitialLoad: boolean = false) {
    if (loading || (!isMoreAvailable && !isInitialLoad)) return; // データ取得中、またはデータがない場合は何もしない
    setLoading(true); // ローディング開始

    // フィルタリングなどの変数の設定
    let variables;
    if (selectedCategory === 'All') {
      variables = {
        postType: "POST", // 投稿タイプで絞り込み
        updatedAt: { beginsWith: "2024-10" }, // 特定の期間に更新されたデータを取得
        sortDirection: 'DESC', // 最新順に並べ替え（列挙型を使用）
        limit: 10, // 最大10件のデータを取得
        filter: {
          deleted: { eq: false }, // 削除されていない投稿を取得
        },
        nextToken: token // ページネーションのためのトークン
      };
    } else {
      variables = {
        postType: "POST", // 投稿タイプで絞り込み
        updatedAt: { beginsWith: "2024-10" }, // 特定の期間に更新されたデータを取得
        sortDirection: 'DESC', // 最新順に並べ替え（列挙型を使用）
        limit: 10, // 最大10件のデータを取得
        filter: {
          deleted: { eq: false }, // 削除されていない投稿を取得
          category: { eq: selectedCategory }, // 選択されたカテゴリで絞り込み
        },
        nextToken: token // ページネーションのためのトークン
      };
    }

    try {
      // データの読み出し
      const apiData = await client.graphql({
        query: postDataByPostTypeAndUpdatedAt, // 選択したカテゴリに基づいて投稿を取得するクエリ
        variables: variables
      });

      const postsFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.items;
      const nextTokenFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.nextToken;

      // 画像URLの取得処理
      await Promise.all(
        postsFromAPI.map(async (post: Post) => {
          if (post.imageUrl) {
            const url = await getUrl({ key: post.imageUrl });
            post.imageUrl = url.url.toString();
          }
          return post;
        })
      );

      setPosts(prevPosts => isInitialLoad ? postsFromAPI : [...prevPosts, ...postsFromAPI]);
      setNextToken(nextTokenFromAPI ?? null); // 次のトークンを保存
      setIsMoreAvailable(!!nextTokenFromAPI); // 次のデータがあるか確認
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false); // ローディング終了
    }
  }

  return (
    <>
      <div style={styles.timeline}>
        {/* カテゴリのドロップダウン */}
        <CategoryDropdown 
          selectedCategory={selectedCategory} 
          categories={categoriesList}  // インポートしたカテゴリリストを使用
          onCategoryChange={setSelectedCategory} 
        />

        {/* 選択されたカテゴリを表示 */}
        <div>
          <p>Selected Category: {selectedCategory}</p>
        </div>

        {/* 投稿のリスト */}
        {loading && posts.length === 0 ? (
          <p>Loading...</p>  // データ取得中はローディング表示
        ) : (
          <ul style={styles.postList}>
            {posts.map((post) => (
              <PostItem key={post.id} post={{ ...post, imageUrl: post.imageUrl ?? undefined }} />
            ))}
          </ul>
        )}

        {/* 追加データがある場合は「Load More」ボタンを表示 */}
        {isMoreAvailable && (
          <button onClick={() => fetchPostData(nextToken)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </>
  );
};

const styles = {
  timeline: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  postList: {
    listStyleType: 'none',
    padding: '0',
  },
};

export default withAuthenticator(TimelinePage);
