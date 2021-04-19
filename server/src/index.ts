import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { __prod__ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/posts/post';
import { UserResolver } from './resolvers/users/user';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import Redis from 'ioredis';
import { INIT_DB } from './config/mongo';
const PORT = process.env.PORT || 5000;

//Solo para que agregue el userId al session
declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

(async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(
    session({
      name: process.env.COOKIE_NAME!,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 annos
        secure: __prod__, //solo funciona en https osea prod
        sameSite: 'lax', //csrf
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET!,
      resave: false,
    })
  );

  //INIT DB
  await INIT_DB();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    //accesar en todos los querys y mutations
    context: ({ req, res }) => ({ req, res, redis: redisClient }),
  });

  server.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`SERVER STARTED\nPORT: ${PORT}`);
  });
})().catch((err) => {
  console.error(err);
});
