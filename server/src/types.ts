import { EntityManager } from '@mikro-orm/mongodb';
import { Response, Request } from 'express';
import Redis from 'ioredis';

export type MyContext = {
  em: EntityManager;
  req: Request;
  res: Response;
  redis: Redis.Redis;
};
