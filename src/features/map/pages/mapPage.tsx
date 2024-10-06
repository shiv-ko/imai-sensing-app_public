// // PostMapPage.tsx
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import { listPostData } from '../../../graphql/queries';
// import { generateClient } from 'aws-amplify/api';
// import { getUrl } from 'aws-amplify/storage';
// import { Amplify } from 'aws-amplify';
// import awsExports from './../../../aws-exports';
// import MapComponent from '../components/mapComponent'; //




// Amplify.configure(awsExports);

// const client = generateClient();

// interface Post {
//   id: string;
//   imageUrl?: string | null;
//   userId: string;
//   lat: number;
//   lng: number;
//   category: string;
//   comment: string;
//   reported: boolean;
//   deleted: boolean;
//   visible: boolean;
//   point: number;
//   postType: string;
// }

// const PostMapPage: React.FC = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

//   useEffect(() => {
//     fetchPostData();
//     getUserLocation();
//   }, []);

//   // ユーザーの位置情報を取得する関数
//   const getUserLocation = () => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
//           setUserPosition([lat, lng]);
//         },
//         (error) => {
//           console.error('Error obtaining geolocation', error);
//           // デフォルトの位置を設定（例：東京）
//           setUserPosition([35.6895, 139.6917]);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by your browser');
//       // デフォルトの位置を設定（例：東京）
//       setUserPosition([35.6895, 139.6917]);
//     }
//   };

//   // 投稿データを取得する関数
//   async function fetchPostData() {
//     const apiData = await client.graphql({ query: listPostData });
//     const postsFromAPI = apiData.data.listPostData.items;
//     await Promise.all(
//       postsFromAPI.map(async (post: Post) => {
//         if (post.imageUrl) {
//           const url = await getUrl({ key: post.imageUrl });
//           post.imageUrl = url.url.toString();
//         }
//         return post;
//       })
//     );
//     setPosts(postsFromAPI);
//   }

//   return (
//     <div>
//       <h2>マップビュー</h2>
//       {userPosition ? (
//         <MapComponent userPosition={userPosition} posts={posts} />
//       ) : (
//         <p>マップを読み込み中...</p>
//       )}
//     </div>
//   );
// };

// export default withAuthenticator(PostMapPage);
