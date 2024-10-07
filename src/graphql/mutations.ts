/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createPostData = /* GraphQL */ `mutation CreatePostData(
  $input: CreatePostDataInput!
  $condition: ModelPostDataConditionInput
) {
  createPostData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePostDataMutationVariables,
  APITypes.CreatePostDataMutation
>;
export const updatePostData = /* GraphQL */ `mutation UpdatePostData(
  $input: UpdatePostDataInput!
  $condition: ModelPostDataConditionInput
) {
  updatePostData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePostDataMutationVariables,
  APITypes.UpdatePostDataMutation
>;
export const deletePostData = /* GraphQL */ `mutation DeletePostData(
  $input: DeletePostDataInput!
  $condition: ModelPostDataConditionInput
) {
  deletePostData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePostDataMutationVariables,
  APITypes.DeletePostDataMutation
>;
export const createLike = /* GraphQL */ `mutation CreateLike(
  $input: CreateLikeInput!
  $condition: ModelLikeConditionInput
) {
  createLike(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateLikeMutationVariables,
  APITypes.CreateLikeMutation
>;
export const updateLike = /* GraphQL */ `mutation UpdateLike(
  $input: UpdateLikeInput!
  $condition: ModelLikeConditionInput
) {
  updateLike(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateLikeMutationVariables,
  APITypes.UpdateLikeMutation
>;
export const deleteLike = /* GraphQL */ `mutation DeleteLike(
  $input: DeleteLikeInput!
  $condition: ModelLikeConditionInput
) {
  deleteLike(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteLikeMutationVariables,
  APITypes.DeleteLikeMutation
>;
export const createCategory = /* GraphQL */ `mutation CreateCategory(
  $input: CreateCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  createCategory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCategoryMutationVariables,
  APITypes.CreateCategoryMutation
>;
export const updateCategory = /* GraphQL */ `mutation UpdateCategory(
  $input: UpdateCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  updateCategory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCategoryMutationVariables,
  APITypes.UpdateCategoryMutation
>;
export const deleteCategory = /* GraphQL */ `mutation DeleteCategory(
  $input: DeleteCategoryInput!
  $condition: ModelCategoryConditionInput
) {
  deleteCategory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCategoryMutationVariables,
  APITypes.DeleteCategoryMutation
>;
export const createNote = /* GraphQL */ `mutation CreateNote(
  $input: CreateNoteInput!
  $condition: ModelNoteConditionInput
) {
  createNote(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateNoteMutationVariables,
  APITypes.CreateNoteMutation
>;
export const updateNote = /* GraphQL */ `mutation UpdateNote(
  $input: UpdateNoteInput!
  $condition: ModelNoteConditionInput
) {
  updateNote(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateNoteMutationVariables,
  APITypes.UpdateNoteMutation
>;
export const deleteNote = /* GraphQL */ `mutation DeleteNote(
  $input: DeleteNoteInput!
  $condition: ModelNoteConditionInput
) {
  deleteNote(input: $input, condition: $condition) {
    id
    name
    description
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteNoteMutationVariables,
  APITypes.DeleteNoteMutation
>;
