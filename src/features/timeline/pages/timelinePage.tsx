// pages/timeline.tsx
import React, { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listPostData } from '../../../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import { Amplify } from 'aws-amplify';
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

  // 投稿データを取得する関数
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
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.category}</h3>
            <p>{post.comment}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.category} style={{ maxWidth: "200px" }} />}
            <p>Location: ({post.lat}, {post.lng})</p>
            <p>Reported: {post.reported ? "Yes" : "No"}</p>
            <p>Deleted: {post.deleted ? "Yes" : "No"}</p>
            <p>Visible: {post.visible ? "Yes" : "No"}</p>
            <p>Points: {post.point}</p>
            <p>Posted by: {post.userId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuthenticator(TimelinePage);