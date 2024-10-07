/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      displayName
      score
      createdAt
      updatedAt
      currentCategoryId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getPostData = /* GraphQL */ `query GetPostData($id: ID!) {
  getPostData(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPostDataQueryVariables,
  APITypes.GetPostDataQuery
>;
export const listPostData = /* GraphQL */ `query ListPostData(
  $filter: ModelPostDataFilterInput
  $limit: Int
  $nextToken: String
) {
  listPostData(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      imageUrl
      userId
      lat
      lng
      category
      comment
      reported
      deleted
      visible
      createdAt
      updatedAt
      point
      postType
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPostDataQueryVariables,
  APITypes.ListPostDataQuery
>;
export const getLike = /* GraphQL */ `query GetLike($id: ID!) {
  getLike(id: $id) {
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
` as GeneratedQuery<APITypes.GetLikeQueryVariables, APITypes.GetLikeQuery>;
export const listLikes = /* GraphQL */ `query ListLikes(
  $filter: ModelLikeFilterInput
  $limit: Int
  $nextToken: String
) {
  listLikes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      postId
      createdAt
      updatedAt
      userLikesId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListLikesQueryVariables, APITypes.ListLikesQuery>;
export const getCategory = /* GraphQL */ `query GetCategory($id: ID!) {
  getCategory(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCategoryQueryVariables,
  APITypes.GetCategoryQuery
>;
export const listCategories = /* GraphQL */ `query ListCategories(
  $filter: ModelCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCategoriesQueryVariables,
  APITypes.ListCategoriesQuery
>;
export const usersByCurrentCategoryId = /* GraphQL */ `query UsersByCurrentCategoryId(
  $currentCategoryId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  usersByCurrentCategoryId(
    currentCategoryId: $currentCategoryId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      displayName
      score
      createdAt
      updatedAt
      currentCategoryId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UsersByCurrentCategoryIdQueryVariables,
  APITypes.UsersByCurrentCategoryIdQuery
>;
export const postDataByUserIdAndUpdatedAt = /* GraphQL */ `query PostDataByUserIdAndUpdatedAt(
  $userId: ID!
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPostDataFilterInput
  $limit: Int
  $nextToken: String
) {
  postDataByUserIdAndUpdatedAt(
    userId: $userId
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      imageUrl
      userId
      lat
      lng
      category
      comment
      reported
      deleted
      visible
      createdAt
      updatedAt
      point
      postType
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PostDataByUserIdAndUpdatedAtQueryVariables,
  APITypes.PostDataByUserIdAndUpdatedAtQuery
>;
export const postDataByPostTypeAndUpdatedAt = /* GraphQL */ `query PostDataByPostTypeAndUpdatedAt(
  $postType: String!
  $updatedAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelPostDataFilterInput
  $limit: Int
  $nextToken: String
) {
  postDataByPostTypeAndUpdatedAt(
    postType: $postType
    updatedAt: $updatedAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      imageUrl
      userId
      lat
      lng
      category
      comment
      reported
      deleted
      visible
      createdAt
      updatedAt
      point
      postType
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PostDataByPostTypeAndUpdatedAtQueryVariables,
  APITypes.PostDataByPostTypeAndUpdatedAtQuery
>;
export const likesByPostId = /* GraphQL */ `query LikesByPostId(
  $postId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelLikeFilterInput
  $limit: Int
  $nextToken: String
) {
  likesByPostId(
    postId: $postId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      postId
      createdAt
      updatedAt
      userLikesId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.LikesByPostIdQueryVariables,
  APITypes.LikesByPostIdQuery
>;
export const getNote = /* GraphQL */ `query GetNote($id: ID!) {
  getNote(id: $id) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetNoteQueryVariables, APITypes.GetNoteQuery>;
export const listNotes = /* GraphQL */ `query ListNotes(
  $filter: ModelNoteFilterInput
  $limit: Int
  $nextToken: String
) {
  listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListNotesQueryVariables, APITypes.ListNotesQuery>;
