import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listPostData } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import PostItem from '../components/postItem';  
import awsExports from '../../../aws-exports';

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

  useEffect(() => {
    fetchPostData();
  }, []);

  async function fetchPostData() {
    const apiData = await client.graphql({ query: listPostData });
    const postsFromAPI = apiData.data.listPostData.items;
    await Promise.all(
      postsFromAPI.map(async (post: Post) => {
        if (post.imageUrl) {
          const url = await getUrl({ key: post.imageUrl });
          post.imageUrl = url.url.toString();
        }
        return post;
      })
    );
    setPosts(postsFromAPI);
  }

  return (
    <div style={styles.timeline}>
      <ul style={styles.postList}>
        {posts.map((post) => (
           <PostItem key={post.id} post={{ ...post, imageUrl: post.imageUrl ?? undefined }} />
        ))}
      </ul>
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
