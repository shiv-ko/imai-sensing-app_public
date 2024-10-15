// src/features/dashboard/utils/awsService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';
import awsExports from '../../../aws-exports';
import { updateUser, createBingoSheet, updateBingoSheet } from '../../../graphql/mutations';
import { getUser, bingoSheetsByUserId, getBingoSheet } from '../../../graphql/queries';
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
 * オブジェクトから __typename フィールドを削除する関数
 * @param obj 任意のオブジェクト
 * @returns __typename フィールドを除外したオブジェクト
 */
function stripTypename<T extends Record<string, any>>(obj: T): {
  [K in keyof T]: T[K] extends Record<string, any> ? ReturnType<typeof stripTypename<T[K]>> : T[K]
} {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  const result: any = {};
  for (const key in obj) {
    if (key !== '__typename') {
      result[key] = typeof obj[key] === 'object' ? stripTypename(obj[key]) : obj[key];
    }
  }
  return result;
}

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
 * @returns ユーザーのビンゴシートまたは null
 */
export async function fetchBingoSheet(userId: string): Promise<BingoSheet | null> {
  try {
    // 1. bingoSheetsByUserIdクエリでビンゴシートを取得
    let nextToken: string | null = null;
    let allSheets: (BingoSheet | null)[] = [];

    do {
      const variables: BingoSheetsByUserIdQueryVariables = {
        userId: userId,
        limit: 1000, // 一度に取得するアイテム数（必要に応じて調整）
        nextToken: nextToken
      };

      const listResult = await client.graphql<BingoSheetsByUserIdQuery>({
        query: bingoSheetsByUserId,
        variables: variables
      }) as GraphQLResult<BingoSheetsByUserIdQuery>;

      console.log('fetchBingoSheet APIレスポンス (List):', JSON.stringify(listResult, null, 2)); // レスポンス全体をログに出力

      if (listResult.errors && listResult.errors.length > 0) {
        console.error('GraphQL errors:', listResult.errors);
        throw new Error('ビンゴシートの取得に失敗しました。');
      }

      if (listResult.data?.bingoSheetsByUserId?.items) {
        allSheets = allSheets.concat(listResult.data.bingoSheetsByUserId.items as (BingoSheet | null)[]);
        nextToken = listResult.data.bingoSheetsByUserId.nextToken ?? null;
      } else {
        nextToken = null;
      }

    } while (nextToken);

    if (allSheets.length === 0) {
      console.log('fetchBingoSheet: bingoSheetsByUserIdクエリでビンゴシートが存在しません。');
      return null;
    }

    // クライアント側で最新のビンゴシートを選択（updatedAt に基づいてソート）
    allSheets.sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    const latestSheet = allSheets[0];
    if (!latestSheet) {
      console.log('fetchBingoSheet: 有効なビンゴシートが見つかりません。');
      return null;
    }

    console.log('fetchBingoSheet: 最新のビンゴシートを選択しました:', JSON.stringify(latestSheet, null, 2));

    // 2. getBingoSheetクエで詳細なビンゴシートを取得
    const variablesForGet: GetBingoSheetQueryVariables = {
      id: latestSheet.id
    };

    const getResult = await client.graphql<GetBingoSheetQuery>({
      query: getBingoSheet,
      variables: variablesForGet
    }) as GraphQLResult<GetBingoSheetQuery>;

    console.log('fetchBingoSheet APIレスポンス (Get):', JSON.stringify(getResult, null, 2)); // レスポンス全体をログに出力

    if (getResult.errors && getResult.errors.length > 0) {
      console.error('GraphQL errors in getBingoSheet:', getResult.errors);
      throw new Error('ビンゴシートの取得に失敗しました。');
    }

    if (getResult.data && getResult.data.getBingoSheet) {
      console.log('fetchBingoSheet: ビンゴシートを取得しました:', JSON.stringify(getResult.data.getBingoSheet, null, 2));
      return getResult.data.getBingoSheet as BingoSheet;
    } else {
      console.log('fetchBingoSheet: getBingoSheetクエリでビンゴシートが存在しません。');
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

/**
 * ユーザーのビンゴシートを作成または更新する関数
 * @param userId ユーザーID
 * @param input 新しいビンゴシートの入力データ
 * @returns 作成または更新されたビンゴシート
 */
export async function createOrUpdateBingoSheet(userId: string, input: CreateBingoSheetMutationVariables['input']): Promise<BingoSheet> {
  try {
    // 1. 既存のビンゴシートを取得
    const existingSheet = await fetchBingoSheet(userId);

    if (existingSheet) {
      console.log('既存のビンゴシートが見つかりました。更新します。');

      // 2. 既存のビンゴシートを更新
      const updatedCells = input.cells.map(cell => stripTypename(cell));

      const updateInput: UpdateBingoSheetInput = {
        id: existingSheet.id,
        cells: updatedCells,
        // 必要に応じて他のフィールドも更新
      };

      const updateResult = await client.graphql<UpdateBingoSheetMutation>({
        query: updateBingoSheet,
        variables: { input: updateInput }
      }) as GraphQLResult<UpdateBingoSheetMutation>;

      console.log('createOrUpdateBingoSheet APIレスポンス (Update):', JSON.stringify(updateResult, null, 2));

      if (updateResult.errors && updateResult.errors.length > 0) {
        console.error('GraphQL errors during update:', updateResult.errors);
        throw new Error('ビンゴシートの更新に失敗しました。');
      }

      if (updateResult.data && updateResult.data.updateBingoSheet) {
        console.log('ビンゴシートが更新されました:', JSON.stringify(updateResult.data.updateBingoSheet, null, 2));
        return updateResult.data.updateBingoSheet as BingoSheet;
      } else {
        throw new Error('ビンゴシートの更新に失敗しました。');
      }

    } else {
      console.log('既存のビンゴシートが存在しません。新規作成します。');

      // 3. 新しいビンゴシートを作成
      const cleanedCells = input.cells.map(cell => stripTypename(cell));

      const cleanedInput = {
        ...input,
        cells: cleanedCells,
        userId: userId, // ユーザーIDを設定
      };

      const createResult = await client.graphql<CreateBingoSheetMutation>({
        query: createBingoSheet,
        variables: { input: cleanedInput }
      }) as GraphQLResult<CreateBingoSheetMutation>;

      console.log('createOrUpdateBingoSheet APIレスポンス (Create):', JSON.stringify(createResult, null, 2));

      if (createResult.errors && createResult.errors.length > 0) {
        console.error('GraphQL errors during creation:', createResult.errors);
        throw new Error('ビンゴシートの作成に失敗しました。');
      }

      if (createResult.data && createResult.data.createBingoSheet) {
        console.log('ビンゴシートが作成されました:', JSON.stringify(createResult.data.createBingoSheet, null, 2));
        return createResult.data.createBingoSheet as BingoSheet;
      } else {
        throw new Error('ビンゴシートの作成に失敗しました。');
      }
    }
  } catch (error) {
    console.error('createOrUpdateBingoSheet エラー:', error);
    throw new Error('ビンゴシートの作成または更新に失敗しました。');
  }
}