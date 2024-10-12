// src/features/dashboard/services/awsService.ts

import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import awsExports from '../../../aws-exports';
import { updateUser } from '../../../graphql/mutations';
import { getUser } from '../../../graphql/queries';
import { UpdateUserMutationVariables } from '../../../API';

// Amplifyの設定
Amplify.configure(awsExports);

// APIクライアントの生成
const client = generateClient();

/**
 * ユーザーのセッションを取得する関数
 */
export async function getUserSession() {
  try {
    return await fetchAuthSession();
  } catch (error) {
    console.error('セッション取得エラー:', error);
    throw new Error('認証エラーが発生しました。');
  }
}

/**
 * ユーザーのデータを取得する関数
 * @param userId ユーザーID
 * @returns ユーザーのデータ
 */
export async function getUserData(userId: string) {
  try {
    const userData = await client.graphql({
      query: getUser,
      variables: { id: userId }
    });
    return userData.data.getUser;
  } catch (error) {
    console.error('ユーザーデータ取得エラー:', error);
    throw new Error('ユーザーデータの取得に失敗しました。');
  }
}

/**
 * ユーザーのスコアを更新する関数
 * @param userId ユーザーID
 * @param newScore 新しいスコア
 * @returns 更新されたユーザー情報
 */
export async function updateUserScore(userId: string, newScore: number): Promise<any> {
  const input: UpdateUserMutationVariables['input'] = {
    id: userId,
    score: newScore,
  };

  try {
    const result = await client.graphql({
      query: updateUser,
      variables: { input },
    });
    console.log('ユーザースコア更新:', result.data?.updateUser);
    return result.data?.updateUser || null;
  } catch (error) {
    console.error('ユーザースコア更新エラー:', error);
    throw new Error('ポイントの更新に失敗しました。');
  }
}

/**
 * ユーザーにポイントを追加する関数
 * @param userId ユーザーID
 * @param points 追加するポイント
 */
export async function addPointsToUser(userId: string, points: number): Promise<void> {
  try {
    const userData = await getUserData(userId);
    const currentScore = userData?.score || 0;
    await updateUserScore(userId, currentScore + points);
  } catch (error) {
    console.error('ユーザーへのポイント追加失敗:', error);
    throw new Error('ポイントの追加に失敗しました。');
  }
}

export const updateUserData = async (input: UpdateUserMutationVariables['input']): Promise<void> => {
  try {
    await client.graphql({
      query: updateUser,
      variables: { input }
    });
  } catch (error) {
    console.error('ユーザーデータの更新に失敗しました', error);
    throw error;
  }
};
