// pages/reportedDeletedPosts/index.tsx

import React, { useState, useEffect } from 'react';
import { postDataByPostTypeAndUpdatedAt } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import PostItem from '../components/adminPostItem';
import awsExports from '../../../aws-exports';
import CategoryDropdown from '@/shared/utils/category/categorydownMenu';
import { categoriesList } from '@/shared/utils/category/categoryList';
import { ModelSortDirection } from '../../../API';

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

const ReportedDeletedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [selectedPostType, setSelectedPostType] = useState<string>('REPORTED');
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMoreAvailable, setIsMoreAvailable] = useState<boolean>(true);

  useEffect(() => {
    resetAndFetchPostData(selectedPostType);
  }, [selectedCategory, selectedPostType]);

  
  const resetAndFetchPostData = (postType: string) => {
    setPosts([]);
    setNextToken(null);
    setIsMoreAvailable(true);
    fetchPostData(null, true, postType);
  };

  const fetchPostData = async (
    token: string | null,
    isInitialLoad: boolean = false,
    postTypeParam?: string
  ) => {
    if (loading || (!isMoreAvailable && !isInitialLoad)) return;
    setLoading(true);

    const postTypeToUse = postTypeParam || selectedPostType;

    let filter = {};
    if (selectedCategory !== 'すべて') {
    filter = {
      ...filter,
      category: { eq: selectedCategory }, // 選択されたカテゴリで絞り込み
    };
  }
    

    const variables = {
      postType: postTypeToUse,
      sortDirection: ModelSortDirection.DESC,
      limit: 50,
      filter: filter,
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
      {/* ナビゲーションボタン */}
      <div style={styles.navigation}>
        <button
          style={selectedPostType === 'REPORTED' ? styles.activeButton : styles.button}
          onClick={() => {
            setSelectedPostType('REPORTED');
            resetAndFetchPostData('REPORTED');
          }}
        >
          通報された投稿
        </button>
        <button
          style={selectedPostType === 'DELETED' ? styles.activeButton : styles.button}
          onClick={() => {
            setSelectedPostType('DELETED');
            resetAndFetchPostData('DELETED');
          }}
        >
          削除された投稿
        </button>
      </div>

      {/* カテゴリドロップダウン */}
      <div style={styles.dropdown}>
        <CategoryDropdown
          selectedCategory={selectedCategory}
          categories={categoriesList}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {loading && posts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul style={styles.postList}>
          {posts.map((post) => (
            <PostItem key={post.id} post={post}/>
          ))}
        </ul>
      )}
      <div style={styles.container}>
        <div style={styles.loadMoreContainer}>
          {isMoreAvailable && (
            <button
              onClick={() => fetchPostData(nextToken)}
              disabled={loading}
              style={styles.loadMoreButton}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  timeline: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  button: {
    margin: '0 10px',
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  activeButton: {
    margin: '0 10px',
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  dropdown: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  },
  postList: {
    listStyleType: 'none',
    padding: '0',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: 'none',
  },
  loadMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadMoreButton: {
    marginTop: '12px',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#296218',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: 1,
    transition: 'background-color 0.3s',
  },
};

export default ReportedDeletedPostsPage;
