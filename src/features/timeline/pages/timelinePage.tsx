import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { postDataByPostTypeAndUpdatedAt } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import PostItem from '../components/postItem';
import awsExports from '../../../aws-exports';
import CategoryDropdown from '@/shared/utils/category/categorydownMenu';
import { categoriesList } from '@/shared/utils/category/categoryList';
import { ModelSortDirection } from '../../../API';
import { getCurrentUser } from 'aws-amplify/auth';

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
}

const TimelinePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>(''); // 現在のユーザーIDを保存
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMoreAvailable, setIsMoreAvailable] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUserAsync();
    resetAndFetchPostData();
  }, [selectedCategory]);

  // 認証済みユーザーのIDを取得
  const getCurrentUserAsync = async () => {
    const user = await getCurrentUser();
    setCurrentUserId(user?.userId ?? ''); // ユーザーIDをセット
  };

  const resetAndFetchPostData = () => {
    setPosts([]);
    setNextToken(null);
    setIsMoreAvailable(true);
    fetchPostData(null, true);
  };

  const fetchPostData = async (token: string | null, isInitialLoad: boolean = false) => {
  if (loading || (!isMoreAvailable && !isInitialLoad)) return;
  setLoading(true);

  interface FilterType {
    reported: { eq: boolean };
    category?: { eq: string }; // category プロパティを追加
  }

  // まず、フィルタの初期値を定義
  let filter: FilterType = {
    reported: { eq: false }, // 通報されていない投稿を取得
  };

  // カテゴリが選択されている場合、フィルタにcategoryを追加
  if (selectedCategory !== 'All') {
    filter = {
      ...filter,
      category: { eq: selectedCategory }, // 選択されたカテゴリで絞り込み
    };
  }

  const variables = {
    postType: 'POST',
    updatedAt: { beginsWith: '2024-10' },
    sortDirection: ModelSortDirection.DESC,
    limit: 10,
    filter: filter, // 修正されたフィルタを使用
    nextToken: token,
  };

  try {
    const apiData = await client.graphql({
      query: postDataByPostTypeAndUpdatedAt,
      variables: variables,
    });

    const postsFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.items;
    const nextTokenFromAPI = apiData.data.postDataByPostTypeAndUpdatedAt.nextToken;

    await Promise.all(
      postsFromAPI.map(async (post: Post) => {
        if (post.imageUrl) {
          const url = await getUrl({ key: post.imageUrl });
          post.imageUrl = url.url.toString();
        }
        return post;
      })
    );

    setPosts((prevPosts) => (isInitialLoad ? postsFromAPI : [...prevPosts, ...postsFromAPI]));
    setNextToken(nextTokenFromAPI ?? null);
    setIsMoreAvailable(!!nextTokenFromAPI);
  } catch (error) {
    console.error('Error fetching data', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={styles.timeline}>
      <CategoryDropdown
        selectedCategory={selectedCategory}
        categories={categoriesList}
        onCategoryChange={setSelectedCategory}
      />

      <div>
        <p>Selected Category: {selectedCategory}</p>
      </div>

      {loading && posts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul style={styles.postList}>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </ul>
      )}

      {isMoreAvailable && (
        <button onClick={() => fetchPostData(nextToken)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
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
