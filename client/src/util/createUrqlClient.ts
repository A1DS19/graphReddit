import { dedupExchange, fetchExchange, stringifyVariables } from 'urql';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { gql } from '@urql/core';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginUserMutation,
  CreateUserMutation,
  VoteMutationVariables,
  DeletePostMutation,
  DeletePostMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        //Cuando hay un error va a redirigir a index.
        Router.replace('/auth/login');
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      'posts'
    );
    let hasMore = true;
    info.partial = !isItInCache;

    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const _hasMore = cache.resolve(key, 'hasMore');

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      results.push(...data);
    });

    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: process.env.NEXT_PUBLIC_API,
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          getPosts: cursorPagination(),
        },
      },
      updates: {
        //Basicamente actualiza el cache para cuando se
        //corra el login mutation actualiza el usuario
        //si es exitosa

        //el nombre de cada mutation es el mismo de la
        //funcion del resolver
        Mutation: {
          deletePost: (_result, args, cache, info) => {
            cache.invalidate({
              __typename: 'Post',
              _id: (args as DeletePostMutationVariables).postId,
            });
          },
          //Update fragment
          vote: (_result, args, cache, info) => {
            const { postId, value } = args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  _id
                  points
                }
              `,
              { _id: postId }
            );

            if (data) {
              const newPoints = (data.points as number) + value;
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    _id
                    points
                  }
                `,
                { _id: postId, points: newPoints }
              );
            }
          },

          createPost: (_result, args, cache, info) => {
            //actualizar cache al crear post
            //el segundo param es el nombre del Query
            //para obtener posts
            const allFields = cache.inspectFields('Query');
            const fieldInfo = allFields.filter((info) => info.fieldName === 'getPosts');
            fieldInfo.forEach((fi) => {
              cache.invalidate('Query', 'getPosts', fi.arguments || {});
            });
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          loginUser: (_result, args, cache, info) => {
            betterUpdateQuery<LoginUserMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.loginUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.loginUser.user,
                  };
                }
              }
            );
          },
          //igual aqui
          createUser: (_result, args, cache, info) => {
            betterUpdateQuery<CreateUserMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.createUser!.errors) {
                  return query;
                } else {
                  return {
                    me: result.createUser!.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
