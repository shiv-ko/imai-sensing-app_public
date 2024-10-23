
import { fetchUserAttributes } from 'aws-amplify/auth';

export async function handleFetchUserAttributes() {
  const userAttributes = await fetchUserAttributes();
  const nickname = userAttributes.nickname || '';
  const userId = userAttributes.sub || '';
  console.log('userAttributes:', userAttributes);
  console.log('userNickName:', nickname);
  return { nickname, userId };
}
