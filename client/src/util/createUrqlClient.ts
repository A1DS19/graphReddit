import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginUserMutation,
  CreateUserMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:5000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        //Basicamente actualiza el cache para cuando se
        //corra el login mutation actualiza el usuario
        //si es exitosa

        //el nombre de cada mutation es el mismo de la
        //funcion del resolver
        Mutation: {
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
    ssrExchange,
    fetchExchange,
  ],
});
