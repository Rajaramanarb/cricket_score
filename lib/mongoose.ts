import mongoose, { Mongoose, MongooseBulkSaveOptions } from "mongoose";
import logger from "./logger";

const MongoDBURI = process.env.MONGODB_URI || "";

if (!MongoDBURI) {
  throw new Error("MongoDB URI not provided.");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("using existing mongo Connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MongoDBURI, {
        dbName: "closetnotion",
      })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.info("Failed to connect to MongoDB", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
