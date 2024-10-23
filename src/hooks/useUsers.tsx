// services/userService.ts
import { generateClient } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { listUsers } from '../graphql/queries';

Amplify.configure(awsExports);

const client = generateClient();

interface User {
  id: string;
  displayName: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  currentCategoryId?: string;
  owner?: string;
}

export async function fetchUsersForRanking(): Promise<User[]> {
  const variables = {
    limit: 1000, // 必要に応じて調整
  };

  const apiData = await client.graphql({
    query: listUsers,
    variables: variables,
  });

  const usersFromAPI = apiData.data.listUsers.items as User[];

  // スコアに基づいて降順にソート
  const sortedUsers = usersFromAPI
    .filter(user => user.score !== null && user.score !== undefined)
    .sort((a, b) => b.score - a.score);

  return sortedUsers;
}
