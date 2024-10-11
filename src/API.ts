/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  displayName: string,
  score: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  currentCategoryId?: string | null,
};

export type ModelUserConditionInput = {
  displayName?: ModelStringInput | null,
  score?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  currentCategoryId?: ModelIDInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  owner?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type User = {
  __typename: "User",
  id: string,
  displayName: string,
  score: number,
  createdAt: string,
  updatedAt: string,
  currentCategoryId?: string | null,
  currentCategory?: Category | null,
  posts?: ModelPostDataConnection | null,
  likes?: ModelLikeConnection | null,
  bingoSheets?: ModelBingoSheetConnection | null,
  owner?: string | null,
};

export type Category = {
  __typename: "Category",
  id: string,
  name: string,
  users?: ModelUserConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelPostDataConnection = {
  __typename: "ModelPostDataConnection",
  items:  Array<PostData | null >,
  nextToken?: string | null,
};

export type PostData = {
  __typename: "PostData",
  id: string,
  imageUrl?: string | null,
  userId: string,
  user?: User | null,
  postedby?: string | null,
  lat: number,
  lng: number,
  category: string,
  comment: string,
  reported: boolean,
  deleted: boolean,
  visible: boolean,
  likes?: ModelLikeConnection | null,
  createdAt: string,
  updatedAt: string,
  point: number,
  postType: string,
  owner?: string | null,
};

export type ModelLikeConnection = {
  __typename: "ModelLikeConnection",
  items:  Array<Like | null >,
  nextToken?: string | null,
};

export type Like = {
  __typename: "Like",
  id: string,
  userId: string,
  postId: string,
  createdAt: string,
  updatedAt: string,
  userLikesId?: string | null,
  owner?: string | null,
};

export type ModelBingoSheetConnection = {
  __typename: "ModelBingoSheetConnection",
  items:  Array<BingoSheet | null >,
  nextToken?: string | null,
};

export type BingoSheet = {
  __typename: "BingoSheet",
  id: string,
  userId: string,
  user?: User | null,
  squares:  Array<BingoSquare | null >,
  createdAt: string,
  isUsed: boolean,
  updatedAt: string,
  owner?: string | null,
};

export type BingoSquare = {
  __typename: "BingoSquare",
  id: string,
  number: number,
  categoryName: string,
  isOpen: boolean,
};

export type UpdateUserInput = {
  id: string,
  displayName?: string | null,
  score?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  currentCategoryId?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreatePostDataInput = {
  id?: string | null,
  imageUrl?: string | null,
  userId: string,
  postedby?: string | null,
  lat: number,
  lng: number,
  category: string,
  comment: string,
  reported: boolean,
  deleted: boolean,
  visible: boolean,
  createdAt?: string | null,
  updatedAt?: string | null,
  point: number,
  postType: string,
};

export type ModelPostDataConditionInput = {
  imageUrl?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  postedby?: ModelStringInput | null,
  lat?: ModelFloatInput | null,
  lng?: ModelFloatInput | null,
  category?: ModelStringInput | null,
  comment?: ModelStringInput | null,
  reported?: ModelBooleanInput | null,
  deleted?: ModelBooleanInput | null,
  visible?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  point?: ModelIntInput | null,
  postType?: ModelStringInput | null,
  and?: Array< ModelPostDataConditionInput | null > | null,
  or?: Array< ModelPostDataConditionInput | null > | null,
  not?: ModelPostDataConditionInput | null,
  owner?: ModelStringInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdatePostDataInput = {
  id: string,
  imageUrl?: string | null,
  userId?: string | null,
  postedby?: string | null,
  lat?: number | null,
  lng?: number | null,
  category?: string | null,
  comment?: string | null,
  reported?: boolean | null,
  deleted?: boolean | null,
  visible?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  point?: number | null,
  postType?: string | null,
};

export type DeletePostDataInput = {
  id: string,
};

export type CreateLikeInput = {
  id?: string | null,
  userId: string,
  postId: string,
  createdAt?: string | null,
  userLikesId?: string | null,
};

export type ModelLikeConditionInput = {
  userId?: ModelIDInput | null,
  postId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelLikeConditionInput | null > | null,
  or?: Array< ModelLikeConditionInput | null > | null,
  not?: ModelLikeConditionInput | null,
  updatedAt?: ModelStringInput | null,
  userLikesId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type UpdateLikeInput = {
  id: string,
  userId?: string | null,
  postId?: string | null,
  createdAt?: string | null,
  userLikesId?: string | null,
};

export type DeleteLikeInput = {
  id: string,
};

export type CreateCategoryInput = {
  id?: string | null,
  name: string,
};

export type ModelCategoryConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelCategoryConditionInput | null > | null,
  or?: Array< ModelCategoryConditionInput | null > | null,
  not?: ModelCategoryConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateCategoryInput = {
  id: string,
  name?: string | null,
};

export type DeleteCategoryInput = {
  id: string,
};

export type CreateBingoSheetInput = {
  id?: string | null,
  userId: string,
  squares: Array< BingoSquareInput | null >,
  createdAt?: string | null,
  isUsed: boolean,
};

export type BingoSquareInput = {
  id: string,
  number: number,
  categoryName: string,
  isOpen: boolean,
};

export type ModelBingoSheetConditionInput = {
  userId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  isUsed?: ModelBooleanInput | null,
  and?: Array< ModelBingoSheetConditionInput | null > | null,
  or?: Array< ModelBingoSheetConditionInput | null > | null,
  not?: ModelBingoSheetConditionInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type UpdateBingoSheetInput = {
  id: string,
  userId?: string | null,
  squares?: Array< BingoSquareInput | null > | null,
  createdAt?: string | null,
  isUsed?: boolean | null,
};

export type DeleteBingoSheetInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  displayName?: ModelStringInput | null,
  score?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  currentCategoryId?: ModelIDInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelPostDataFilterInput = {
  id?: ModelIDInput | null,
  imageUrl?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  postedby?: ModelStringInput | null,
  lat?: ModelFloatInput | null,
  lng?: ModelFloatInput | null,
  category?: ModelStringInput | null,
  comment?: ModelStringInput | null,
  reported?: ModelBooleanInput | null,
  deleted?: ModelBooleanInput | null,
  visible?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  point?: ModelIntInput | null,
  postType?: ModelStringInput | null,
  and?: Array< ModelPostDataFilterInput | null > | null,
  or?: Array< ModelPostDataFilterInput | null > | null,
  not?: ModelPostDataFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelLikeFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  postId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLikeFilterInput | null > | null,
  or?: Array< ModelLikeFilterInput | null > | null,
  not?: ModelLikeFilterInput | null,
  userLikesId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelCategoryFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCategoryFilterInput | null > | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  not?: ModelCategoryFilterInput | null,
};

export type ModelCategoryConnection = {
  __typename: "ModelCategoryConnection",
  items:  Array<Category | null >,
  nextToken?: string | null,
};

export type ModelBingoSheetFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  isUsed?: ModelBooleanInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBingoSheetFilterInput | null > | null,
  or?: Array< ModelBingoSheetFilterInput | null > | null,
  not?: ModelBingoSheetFilterInput | null,
  owner?: ModelStringInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  score?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  currentCategoryId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  userLikesId?: ModelSubscriptionIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionPostDataFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  imageUrl?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionIDInput | null,
  postedby?: ModelSubscriptionStringInput | null,
  lat?: ModelSubscriptionFloatInput | null,
  lng?: ModelSubscriptionFloatInput | null,
  category?: ModelSubscriptionStringInput | null,
  comment?: ModelSubscriptionStringInput | null,
  reported?: ModelSubscriptionBooleanInput | null,
  deleted?: ModelSubscriptionBooleanInput | null,
  visible?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  point?: ModelSubscriptionIntInput | null,
  postType?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPostDataFilterInput | null > | null,
  or?: Array< ModelSubscriptionPostDataFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionLikeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  postId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLikeFilterInput | null > | null,
  or?: Array< ModelSubscriptionLikeFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionCategoryFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
  or?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
};

export type ModelSubscriptionBingoSheetFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  isUsed?: ModelSubscriptionBooleanInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBingoSheetFilterInput | null > | null,
  or?: Array< ModelSubscriptionBingoSheetFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type CreatePostDataMutationVariables = {
  input: CreatePostDataInput,
  condition?: ModelPostDataConditionInput | null,
};

export type CreatePostDataMutation = {
  createPostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type UpdatePostDataMutationVariables = {
  input: UpdatePostDataInput,
  condition?: ModelPostDataConditionInput | null,
};

export type UpdatePostDataMutation = {
  updatePostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type DeletePostDataMutationVariables = {
  input: DeletePostDataInput,
  condition?: ModelPostDataConditionInput | null,
};

export type DeletePostDataMutation = {
  deletePostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type CreateLikeMutationVariables = {
  input: CreateLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type CreateLikeMutation = {
  createLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateLikeMutationVariables = {
  input: UpdateLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type UpdateLikeMutation = {
  updateLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteLikeMutationVariables = {
  input: DeleteLikeInput,
  condition?: ModelLikeConditionInput | null,
};

export type DeleteLikeMutation = {
  deleteLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateCategoryMutationVariables = {
  input: CreateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type CreateCategoryMutation = {
  createCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  input: UpdateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type UpdateCategoryMutation = {
  updateCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  input: DeleteCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type DeleteCategoryMutation = {
  deleteCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateBingoSheetMutationVariables = {
  input: CreateBingoSheetInput,
  condition?: ModelBingoSheetConditionInput | null,
};

export type CreateBingoSheetMutation = {
  createBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateBingoSheetMutationVariables = {
  input: UpdateBingoSheetInput,
  condition?: ModelBingoSheetConditionInput | null,
};

export type UpdateBingoSheetMutation = {
  updateBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteBingoSheetMutationVariables = {
  input: DeleteBingoSheetInput,
  condition?: ModelBingoSheetConditionInput | null,
};

export type DeleteBingoSheetMutation = {
  deleteBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPostDataQueryVariables = {
  id: string,
};

export type GetPostDataQuery = {
  getPostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type ListPostDataQueryVariables = {
  filter?: ModelPostDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostDataQuery = {
  listPostData?:  {
    __typename: "ModelPostDataConnection",
    items:  Array< {
      __typename: "PostData",
      id: string,
      imageUrl?: string | null,
      userId: string,
      postedby?: string | null,
      lat: number,
      lng: number,
      category: string,
      comment: string,
      reported: boolean,
      deleted: boolean,
      visible: boolean,
      createdAt: string,
      updatedAt: string,
      point: number,
      postType: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetLikeQueryVariables = {
  id: string,
};

export type GetLikeQuery = {
  getLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListLikesQueryVariables = {
  filter?: ModelLikeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLikesQuery = {
  listLikes?:  {
    __typename: "ModelLikeConnection",
    items:  Array< {
      __typename: "Like",
      id: string,
      userId: string,
      postId: string,
      createdAt: string,
      updatedAt: string,
      userLikesId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCategoriesQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategoriesQuery = {
  listCategories?:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBingoSheetQueryVariables = {
  id: string,
};

export type GetBingoSheetQuery = {
  getBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListBingoSheetsQueryVariables = {
  filter?: ModelBingoSheetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBingoSheetsQuery = {
  listBingoSheets?:  {
    __typename: "ModelBingoSheetConnection",
    items:  Array< {
      __typename: "BingoSheet",
      id: string,
      userId: string,
      createdAt: string,
      isUsed: boolean,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByCurrentCategoryIdQueryVariables = {
  currentCategoryId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByCurrentCategoryIdQuery = {
  usersByCurrentCategoryId?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PostDataByUserIdAndUpdatedAtQueryVariables = {
  userId: string,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostDataByUserIdAndUpdatedAtQuery = {
  postDataByUserIdAndUpdatedAt?:  {
    __typename: "ModelPostDataConnection",
    items:  Array< {
      __typename: "PostData",
      id: string,
      imageUrl?: string | null,
      userId: string,
      postedby?: string | null,
      lat: number,
      lng: number,
      category: string,
      comment: string,
      reported: boolean,
      deleted: boolean,
      visible: boolean,
      createdAt: string,
      updatedAt: string,
      point: number,
      postType: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PostDataByPostTypeAndUpdatedAtQueryVariables = {
  postType: string,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostDataByPostTypeAndUpdatedAtQuery = {
  postDataByPostTypeAndUpdatedAt?:  {
    __typename: "ModelPostDataConnection",
    items:  Array< {
      __typename: "PostData",
      id: string,
      imageUrl?: string | null,
      userId: string,
      postedby?: string | null,
      lat: number,
      lng: number,
      category: string,
      comment: string,
      reported: boolean,
      deleted: boolean,
      visible: boolean,
      createdAt: string,
      updatedAt: string,
      point: number,
      postType: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type LikesByPostIdQueryVariables = {
  postId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelLikeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type LikesByPostIdQuery = {
  likesByPostId?:  {
    __typename: "ModelLikeConnection",
    items:  Array< {
      __typename: "Like",
      id: string,
      userId: string,
      postId: string,
      createdAt: string,
      updatedAt: string,
      userLikesId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BingoSheetsByUserIdAndCreatedAtQueryVariables = {
  userId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBingoSheetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BingoSheetsByUserIdAndCreatedAtQuery = {
  bingoSheetsByUserIdAndCreatedAt?:  {
    __typename: "ModelBingoSheetConnection",
    items:  Array< {
      __typename: "BingoSheet",
      id: string,
      userId: string,
      createdAt: string,
      isUsed: boolean,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    displayName: string,
    score: number,
    createdAt: string,
    updatedAt: string,
    currentCategoryId?: string | null,
    currentCategory?:  {
      __typename: "Category",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    posts?:  {
      __typename: "ModelPostDataConnection",
      nextToken?: string | null,
    } | null,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    bingoSheets?:  {
      __typename: "ModelBingoSheetConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnCreatePostDataSubscriptionVariables = {
  filter?: ModelSubscriptionPostDataFilterInput | null,
};

export type OnCreatePostDataSubscription = {
  onCreatePostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type OnUpdatePostDataSubscriptionVariables = {
  filter?: ModelSubscriptionPostDataFilterInput | null,
};

export type OnUpdatePostDataSubscription = {
  onUpdatePostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type OnDeletePostDataSubscriptionVariables = {
  filter?: ModelSubscriptionPostDataFilterInput | null,
};

export type OnDeletePostDataSubscription = {
  onDeletePostData?:  {
    __typename: "PostData",
    id: string,
    imageUrl?: string | null,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    postedby?: string | null,
    lat: number,
    lng: number,
    category: string,
    comment: string,
    reported: boolean,
    deleted: boolean,
    visible: boolean,
    likes?:  {
      __typename: "ModelLikeConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    point: number,
    postType: string,
    owner?: string | null,
  } | null,
};

export type OnCreateLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnCreateLikeSubscription = {
  onCreateLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnUpdateLikeSubscription = {
  onUpdateLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteLikeSubscriptionVariables = {
  filter?: ModelSubscriptionLikeFilterInput | null,
};

export type OnDeleteLikeSubscription = {
  onDeleteLike?:  {
    __typename: "Like",
    id: string,
    userId: string,
    postId: string,
    createdAt: string,
    updatedAt: string,
    userLikesId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnCreateCategorySubscription = {
  onCreateCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory?:  {
    __typename: "Category",
    id: string,
    name: string,
    users?:  {
      __typename: "ModelUserConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateBingoSheetSubscriptionVariables = {
  filter?: ModelSubscriptionBingoSheetFilterInput | null,
};

export type OnCreateBingoSheetSubscription = {
  onCreateBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateBingoSheetSubscriptionVariables = {
  filter?: ModelSubscriptionBingoSheetFilterInput | null,
};

export type OnUpdateBingoSheetSubscription = {
  onUpdateBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteBingoSheetSubscriptionVariables = {
  filter?: ModelSubscriptionBingoSheetFilterInput | null,
};

export type OnDeleteBingoSheetSubscription = {
  onDeleteBingoSheet?:  {
    __typename: "BingoSheet",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      displayName: string,
      score: number,
      createdAt: string,
      updatedAt: string,
      currentCategoryId?: string | null,
      owner?: string | null,
    } | null,
    squares:  Array< {
      __typename: "BingoSquare",
      id: string,
      number: number,
      categoryName: string,
      isOpen: boolean,
    } | null >,
    createdAt: string,
    isUsed: boolean,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
