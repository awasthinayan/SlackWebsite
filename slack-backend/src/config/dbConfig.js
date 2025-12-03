import mongoose from "mongoose";

import { MONGO_URI, NODE_ENV, PROD_DB_URL } from './serverConfig.js';

export default async function connectDB() {
  try {
    if (NODE_ENV === 'development') {
      await mongoose.connect(MONGO_URI);
    } else if (NODE_ENV === 'production') {
      await mongoose.connect(PROD_DB_URL);
    }
    console.log(`Connected to mongodb database from ${NODE_ENV} environment`);
  } catch (error) {
    console.log('Error connecting to database', error);
  }
}