import mongoose from 'mongoose';

export const INIT_DB = async (): Promise<Boolean> => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: 'graphReddit',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    mongoose.set(
      'debug',
      (collectionName: string, method: string, query: string, doc: string) => {
        console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
      }
    );

    console.log(`DB CONNECTED`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
