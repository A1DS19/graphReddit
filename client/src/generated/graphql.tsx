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
  createUser?: Maybe<UserResponse>;
  loginUser: UserResponse;
  logout: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  changePassword: UserResponse;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['String'];
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
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

export type Post = {
  __typename?: 'Post';
  title: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPosts: Array<Post>;
  getPost?: Maybe<Post>;
  me?: Maybe<User>;
};


export type QueryGetPostArgs = {
  postId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

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
  & Pick<User, 'id' | 'email'>
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

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'title' | 'createdAt' | 'updatedAt'>
  )> }
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & SimpleUserFragment
  )> }
);

export const SimpleErrorFragmentDoc = gql`
    fragment SimpleError on FieldError {
  field
  msg
}
    `;
export const SimpleUserFragmentDoc = gql`
    fragment SimpleUser on User {
  id
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
export const PostsDocument = gql`
    query Posts {
  getPosts {
    id
    title
    createdAt
    updatedAt
  }
}
    `;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
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
export const MeDocument = gql`
    query Me {
  me {
    ...SimpleUser
  }
}
    ${SimpleUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};