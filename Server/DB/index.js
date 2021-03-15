import MongoDB from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const createMongoClient = () =>
  new MongoDB.MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
