import MongoDB from 'mongodb';

if (process.env.NODE_ENV === 'development') {
  import('dotenv').then((dotenv) => dotenv.config());
}

export const createMongoClient = () =>
  new MongoDB.MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
