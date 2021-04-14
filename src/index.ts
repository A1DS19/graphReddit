import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

(async () => {
  const orm = await MikroORM.init({
    dbName: 'graphReddit',
    type: 'mongo',
    clientUrl: 'mongodb://localhost:27017',
    debug: !__prod__ && true,
    entities: [Post],
  });
})().catch((err) => {
  console.error(err);
});
