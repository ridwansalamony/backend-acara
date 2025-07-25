import mongoose, { mongo } from "mongoose";
import { DATABASE_URL } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-acara",
    });

    return Promise.resolve("database connected!");
  } catch (error) {
    const err = error as Error;
    return Promise.reject(err);
  }
};

export default connect;
