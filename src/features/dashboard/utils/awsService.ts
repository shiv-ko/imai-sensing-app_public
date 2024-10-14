// src/features/dashboard/utils/awsService.ts

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import awsExports from '../../../aws-exports';
import { updateUser, createBingoSheet, updateBingoSheet } from '../../../graphql/mutations'; // updateBingoSheet を追加
import { getUser, bingoSheetsByUserId, getBingoSheet } from '../../../graphql/queries'; // getBingoSheet をインポート
import { 
  UpdateUserMutationVariables, 
  UpdateUserMutation, 
  GetUserQuery, 
  BingoSheet, 
  CreateBingoSheetMutation, 
  CreateBingoSheetMutationVariables, 
  BingoSheetsByUserIdQuery, 
  BingoSheetsByUserIdQueryVariables,
  GetBingoSheetQuery,
  GetBingoSheetQueryVariables,
  UpdateBingoSheetMutation,
  UpdateBingoSheetInput
} from '../../../API';
import { GraphQLResult } from '@aws-amplify/api-graphql';

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
export async function getUserData(userId: string): Promise<GetUserQuery['getUser']> {
  try {
    const userData = await client.graphql<GetUserQuery>({
      query: getUser,
      variables: { id: userId }
    }) as GraphQLResult<GetUserQuery>;

    console.log('getUserData APIレスポンス:', JSON.stringify(userData, null, 2)); // レスポンス全体をログに出力

    if (userData && userData.data && userData.data.getUser) {
      return userData.data.getUser;
    } else {
      throw new Error('有効なユーザーデータが取得できませんでした。');
    }
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
export async function updateUserScore(userId: string, newScore: number): Promise<UpdateUserMutation['updateUser']> {
  const input: UpdateUserMutationVariables['input'] = {
    id: userId,
    score: newScore,
  };

  try {
    const result = await client.graphql<UpdateUserMutation>({
      query: updateUser,
      variables: { input },
    }) as GraphQLResult<UpdateUserMutation>;

    console.log('ユーザースコア更新:', JSON.stringify(result.data?.updateUser, null, 2));
    return result.data?.updateUser as UpdateUserMutation['updateUser'];
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
    console.log(`ユーザー ${userId} に ${points} ポイントを追加しました。新しいスコア: ${currentScore + points}`);
  } catch (error) {
    console.error('ユーザーへのポイント追加失敗:', error);
    throw new Error('ポイントの追加に失敗しました。');
  }
}

export const updateUserData = async (input: UpdateUserMutationVariables['input']): Promise<void> => {
  try {
    const result = await client.graphql<UpdateUserMutation>({
      query: updateUser,
      variables: { input }
    }) as GraphQLResult<UpdateUserMutation>;

    console.log('updateUserData APIレスポンス:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('ユーザーデータの更新に失敗しました', error);
    throw error;
  }
};


function stripTypename<T extends { __typename?: string }>(obj: T): Omit<T, '__typename'> {
 const { __typename, ...rest } = obj;
 return rest;
}

// ... 既存のコード

/**
* 指定されたビンゴシートIDとカテゴリ名に基づいて、セルの isCompleted を true に更新する関数
* @param sheetId ビンゴシートのID
* @param category 完了したカテゴリ名
* @returns 更新されたビンゴシートまたは null
*/
export async function markCategoryAsCompleted(sheetId: string, category: string): Promise<BingoSheet | null> {
 try {
   // 1. 現在のビンゴシートを取得
   const variablesForGet: GetBingoSheetQueryVariables = {
     id: sheetId
   };

   const getResult = await client.graphql<GetBingoSheetQuery>({
     query: getBingoSheet,
     variables: variablesForGet
   }) as GraphQLResult<GetBingoSheetQuery>;

   console.log('markCategoryAsCompleted APIレスポンス (Get):', JSON.stringify(getResult, null, 2));

   if (!getResult.data || !getResult.data.getBingoSheet) {
     console.log('markCategoryAsCompleted: ビンゴシートが存在しません。');
     return null;
   }

   const bingoSheet = getResult.data.getBingoSheet;

   // 2. cells 配列を更新（__typename を除外）
   const updatedCells = bingoSheet.cells.map(cell => {
     if (cell.category === category) {
       return stripTypename({ ...cell, isCompleted: true });
     }
     return stripTypename(cell);
   });

   // 3. updateBingoSheet ミューテーションを実行
   const input: UpdateBingoSheetInput = {
     id: sheetId,
     cells: updatedCells,
     // 必要に応じて他のフィールドも更新
   };

   const updateResult = await client.graphql<UpdateBingoSheetMutation>({
     query: updateBingoSheet,
     variables: { input }
   }) as GraphQLResult<UpdateBingoSheetMutation>;

   console.log('markCategoryAsCompleted APIレスポンス (Update):', JSON.stringify(updateResult, null, 2));

   if (updateResult.data && updateResult.data.updateBingoSheet) {
     console.log(`カテゴリ "${category}" を完了しました。ビンゴシートが更新されました。`);
     return updateResult.data.updateBingoSheet;
   } else {
     console.log('markCategoryAsCompleted: ビンゴシートの更新に失敗しました。');
     return null;
   }
 } catch (error) {
   console.error('markCategoryAsCompleted エラー:', error);
   throw new Error('ビンゴシートの更新に失敗しました。');
 }
}

/**
 * ユーザーのビンゴシートを取得する関数（bingoSheetsByUserIdを使用してIDを取得し、getBingoSheetを使用）
 * @param userId ユーザーID
 * @returns ユーザーのビンゴシートまたはnull
 */
export async function fetchBingoSheet(userId: string): Promise<BingoSheet | null> {
  try {
    // 1. bingoSheetsByUserIdクエリで最新のビンゴシートIDを取得
    const variablesForList: BingoSheetsByUserIdQueryVariables = {
      userId: userId,
      limit: 1 // 最新のビンゴシートを取得するためにlimitを1に設定
    };

    const listResult = await client.graphql<BingoSheetsByUserIdQuery>({
      query: bingoSheetsByUserId,
      variables: variablesForList
    }) as GraphQLResult<BingoSheetsByUserIdQuery>;

    console.log('fetchBingoSheet APIレスポンス (List):', JSON.stringify(listResult, null, 2)); // レスポンス全体をログに出力

    if (listResult && listResult.data && listResult.data.bingoSheetsByUserId && listResult.data.bingoSheetsByUserId.items.length > 0) {
      const latestSheetId = listResult.data?.bingoSheetsByUserId?.items?.[0]?.id ?? null;
      if (latestSheetId) {
        console.log('最新のビンゴシートID:', latestSheetId);
        // 2. getBingoSheetクエリで詳細なビンゴシートを取得
        const variablesForGet: GetBingoSheetQueryVariables = {
          id: latestSheetId
        };

        const getResult = await client.graphql<GetBingoSheetQuery>({
          query: getBingoSheet,
          variables: variablesForGet
        }) as GraphQLResult<GetBingoSheetQuery>;

        console.log('fetchBingoSheet APIレスポンス (Get):', JSON.stringify(getResult, null, 2)); // レスポンス全体をログに出力

        if (getResult && getResult.data && getResult.data.getBingoSheet) {
          console.log('fetchBingoSheet: ビンゴシートを取得しました:', JSON.stringify(getResult.data.getBingoSheet, null, 2));
          return getResult.data.getBingoSheet as BingoSheet;
        } else {
          console.log('fetchBingoSheet: getBingoSheetクエリでビンゴシートが存在しません。');
          return null;
        }
      } else {
        console.log('ビンゴシートが見つかりませんでした。');
        return null;
      }
    } else {
      console.log('fetchBingoSheet: bingoSheetsByUserIdクエリでビンゴシートが存在しません。');
      return null;
    }
  } catch (error) {
    console.error('fetchBingoSheet エラー:', error);
    throw new Error('ビンゴシートの取得に失敗しました。');
  }
}

/**
 * 新しいビンゴシートを作成する関数
 * @param input ビンゴシートの入力データ
 * @returns 作成されたビンゴシート
 */
export async function createNewBingoSheet(input: CreateBingoSheetMutationVariables['input']): Promise<CreateBingoSheetMutation['createBingoSheet']> {
  try {
    const result = await client.graphql<CreateBingoSheetMutation>({
      query: createBingoSheet,
      variables: { input }
    }) as GraphQLResult<CreateBingoSheetMutation>;

    console.log('createNewBingoSheet APIレスポンス:', JSON.stringify(result, null, 2)); // レスポンス全体をログに出力

    if (result && result.data && result.data.createBingoSheet) {
      console.log('createNewBingoSheet: ビンゴシートが作成されました:', JSON.stringify(result.data.createBingoSheet, null, 2));
      return result.data.createBingoSheet;
    } else {
      throw new Error('ビンゴシートの作成に失敗しました。');
    }
  } catch (error) {
    console.error('ビンゴシート作成エラー:', error);
    throw new Error('ビンゴシートの作成中にエラーが発生しました。');
  }
}
