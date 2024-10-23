import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import {  updateUser } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import {  getUser } from '../graphql/queries';
Amplify.configure(awsExports);

const client = generateClient();


async function updateUserScore(userId: string, scoreDelta: number){
  // 現在のユーザーデータを取得
  const getUserData = await client.graphql({
    query: getUser,
    variables: { id: userId },
  });

  if (!getUserData.data || !getUserData.data.getUser) {
    throw new Error('ユーザーが見つかりませんでした');
  }

  const currentUser = getUserData.data.getUser;

  // 新しいスコアを計算
  const newScore = (currentUser.score || 0) + scoreDelta;

  // ユーザーのスコアを更新
  const updateUserData = await client.graphql({
    query: updateUser,
    variables: {
      input: {
        id: userId,
        score: newScore,
      },
    },
  });

  if (!updateUserData.data || !updateUserData.data.updateUser) {
    throw new Error('ユーザーの更新に失敗しました');
  }

  return updateUserData.data.updateUser;
}

export default updateUserScore;