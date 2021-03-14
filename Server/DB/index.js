import MongoDB from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoDB.MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

export default mongoClient;
