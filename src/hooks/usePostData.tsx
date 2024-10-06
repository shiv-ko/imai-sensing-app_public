// 'use client'
// import { useState, useEffect } from 'react';
// import { listPostData } from '../graphql/queries';
// import { generateClient } from 'aws-amplify/api';
// import { getUrl } from 'aws-amplify/storage';
// import { Amplify } from 'aws-amplify';
// import awsExports from '../aws-exports';

// Amplify.configure(awsExports);

// const client = generateClient();

// export interface Post {
//   id: string;
//   imageUrl?: string;
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

// export  const usePostData = async (): Promise<Post[]> => {
//   try {
//     const apiData = await client.graphql({ query: listPostData });
//     const postsFromAPI = apiData.data.listPostData.items;

//     // 画像のURL取得やlat, lng変換処理を並列で実行
//     const processedPosts = await Promise.all(
//       postsFromAPI.map(async (post: Post) => {
//         if (post.imageUrl) {
//           const url = await getUrl({ key: post.imageUrl });
//           post.imageUrl = url.url.toString();
//         }
//         post.lat = Number(post.lat);
//         post.lng = Number(post.lng);
//         return post;
//       })
//     );

//     return processedPosts;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return [];
//   }
// };
