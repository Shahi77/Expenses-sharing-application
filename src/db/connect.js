import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME,
    });
    console.log(
      "MongoDB connected on host: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDb;
