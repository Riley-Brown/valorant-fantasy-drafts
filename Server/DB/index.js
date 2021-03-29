import MongoDB from 'mongodb';

export const createMongoClient = () =>
  new MongoDB.MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
