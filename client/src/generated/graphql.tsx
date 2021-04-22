import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type ChangePasswordInput = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  msg: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  createUser?: Maybe<UserResponse>;
  loginUser: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationDeletePostArgs = {
  postId: Scalars['String'];
};


export type MutationVoteArgs = {
  value: Scalars['Float'];
  postId: Scalars['String'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationLoginUserArgs = {
  input: CreateUserInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  title: Scalars['String'];
  text: Scalars['String'];
  points: Scalars['Int'];
  creator: User;
  textSnippet: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPosts: PaginatedPosts;
  getPost?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryGetPostsArgs = {
  cursor?: Maybe<Scalars['DateTime']>;
  limit: Scalars['Int'];
};


export type QueryGetPostArgs = {
  postId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  email: Scalars['String'];
  votedPosts: Array<VotedPost>;
  publicEmail: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type VotedPost = {
  __typename?: 'VotedPost';
  postId: Scalars['String'];
  voteValue: Scalars['Float'];
};

export type CreatePostInput = {
  title: Scalars['String'];
  text: Scalars['String'];
};

export type UpdatePostInput = {
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type PostSnippetFragment = (
  { __typename?: 'Post' }
  & Pick<Post, '_id' | 'title' | 'textSnippet' | 'createdAt' | 'points'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, '_id' | 'email'>
  ) }
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & SimpleErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & SimpleUserFragment
  )> }
);

export type SimpleErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'msg'>
);

export type SimpleUserFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'email'>
);

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LoginUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser?: Maybe<(
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  )> }
);

export type SendForgetPassEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendForgetPassEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, '_id'>
  ) }
);

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, '_id' | 'title' | 'text' | 'textSnippet' | 'createdAt' | 'updatedAt'>
  )> }
);

export type VoteMutationVariables = Exact<{
  value: Scalars['Float'];
  postId: Scalars['String'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & { votedPosts: Array<(
      { __typename?: 'VotedPost' }
      & Pick<VotedPost, 'postId' | 'voteValue'>
    )> }
    & SimpleUserFragment
  )> }
);

export type PostQueryVariables = Exact<{
  postId: Scalars['String'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { getPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, '_id' | 'title' | 'text' | 'createdAt'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, '_id' | 'email'>
    ) }
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['DateTime']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & PostSnippetFragment
    )> }
  ) }
);

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  _id
  title
  textSnippet
  createdAt
  points
  creator {
    _id
    email
  }
}
    `;
export const SimpleErrorFragmentDoc = gql`
    fragment SimpleError on FieldError {
  field
  msg
}
    `;
export const SimpleUserFragmentDoc = gql`
    fragment SimpleUser on User {
  _id
  email
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...SimpleError
  }
  user {
    ...SimpleUser
  }
}
    ${SimpleErrorFragmentDoc}
${SimpleUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation changePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const LoginUserDocument = gql`
    mutation LoginUser($input: CreateUserInput!) {
  loginUser(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginUserMutation() {
  return Urql.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const SendForgetPassEmailDocument = gql`
    mutation SendForgetPassEmail($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useSendForgetPassEmailMutation() {
  return Urql.useMutation<SendForgetPassEmailMutation, SendForgetPassEmailMutationVariables>(SendForgetPassEmailDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: createPostInput!) {
  createPost(input: $input) {
    _id
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($postId: String!) {
  deletePost(postId: $postId)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($input: updatePostInput!) {
  updatePost(input: $input) {
    _id
    title
    text
    textSnippet
    createdAt
    updatedAt
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Float!, $postId: String!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...SimpleUser
    votedPosts {
      postId
      voteValue
    }
  }
}
    ${SimpleUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const PostDocument = gql`
    query Post($postId: String!) {
  getPost(postId: $postId) {
    _id
    title
    text
    creator {
      _id
      email
    }
    createdAt
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: DateTime) {
  getPosts(limit: $limit, cursor: $cursor) {
    posts {
      ...PostSnippet
    }
    hasMore
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};