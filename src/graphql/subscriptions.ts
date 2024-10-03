/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    id
    displayName
    score
    createdAt
    updatedAt
    currentCategoryId
    currentCategory {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    posts {
      nextToken
      __typename
    }
    likes {
      nextToken
      __typename
    }
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    id
    displayName
    score
    createdAt
    updatedAt
    currentCategoryId
    currentCategory {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    posts {
      nextToken
      __typename
    }
    likes {
      nextToken
      __typename
    }
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    id
    displayName
    score
    createdAt
    updatedAt
    currentCategoryId
    currentCategory {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    posts {
      nextToken
      __typename
    }
    likes {
      nextToken
      __typename
    }
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreatePostData = /* GraphQL */ `subscription OnCreatePostData($filter: ModelSubscriptionPostDataFilterInput) {
  onCreatePostData(filter: $filter) {
    id
    imageUrl
    userId
    user {
      id
      displayName
      score
      createdAt
      updatedAt
      currentCategoryId
      owner
      __typename
    }
    lat
    lng
    category
    comment
    reported
    deleted
    visible
    likes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    point
    postType
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePostDataSubscriptionVariables,
  APITypes.OnCreatePostDataSubscription
>;
export const onUpdatePostData = /* GraphQL */ `subscription OnUpdatePostData($filter: ModelSubscriptionPostDataFilterInput) {
  onUpdatePostData(filter: $filter) {
    id
    imageUrl
    userId
    user {
      id
      displayName
      score
      createdAt
      updatedAt
      currentCategoryId
      owner
      __typename
    }
    lat
    lng
    category
    comment
    reported
    deleted
    visible
    likes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    point
    postType
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePostDataSubscriptionVariables,
  APITypes.OnUpdatePostDataSubscription
>;
export const onDeletePostData = /* GraphQL */ `subscription OnDeletePostData($filter: ModelSubscriptionPostDataFilterInput) {
  onDeletePostData(filter: $filter) {
    id
    imageUrl
    userId
    user {
      id
      displayName
      score
      createdAt
      updatedAt
      currentCategoryId
      owner
      __typename
    }
    lat
    lng
    category
    comment
    reported
    deleted
    visible
    likes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    point
    postType
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePostDataSubscriptionVariables,
  APITypes.OnDeletePostDataSubscription
>;
export const onCreateLike = /* GraphQL */ `subscription OnCreateLike($filter: ModelSubscriptionLikeFilterInput) {
  onCreateLike(filter: $filter) {
    id
    userId
    postId
    createdAt
    updatedAt
    userLikesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLikeSubscriptionVariables,
  APITypes.OnCreateLikeSubscription
>;
export const onUpdateLike = /* GraphQL */ `subscription OnUpdateLike($filter: ModelSubscriptionLikeFilterInput) {
  onUpdateLike(filter: $filter) {
    id
    userId
    postId
    createdAt
    updatedAt
    userLikesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLikeSubscriptionVariables,
  APITypes.OnUpdateLikeSubscription
>;
export const onDeleteLike = /* GraphQL */ `subscription OnDeleteLike($filter: ModelSubscriptionLikeFilterInput) {
  onDeleteLike(filter: $filter) {
    id
    userId
    postId
    createdAt
    updatedAt
    userLikesId
    owner
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLikeSubscriptionVariables,
  APITypes.OnDeleteLikeSubscription
>;
export const onCreateCategory = /* GraphQL */ `subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onCreateCategory(filter: $filter) {
    id
    name
    users {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCategorySubscriptionVariables,
  APITypes.OnCreateCategorySubscription
>;
export const onUpdateCategory = /* GraphQL */ `subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onUpdateCategory(filter: $filter) {
    id
    name
    users {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCategorySubscriptionVariables,
  APITypes.OnUpdateCategorySubscription
>;
export const onDeleteCategory = /* GraphQL */ `subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
  onDeleteCategory(filter: $filter) {
    id
    name
    users {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCategorySubscriptionVariables,
  APITypes.OnDeleteCategorySubscription
>;
