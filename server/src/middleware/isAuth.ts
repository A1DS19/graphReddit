import { MyContext } from './../types';
import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    if (!context.req.session.userId) {
      throw new Error('no autenticado');
    }

    return next();
  } catch (err) {
    throw new Error(err.message);
  }
};
