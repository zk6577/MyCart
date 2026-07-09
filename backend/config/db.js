

import mongoose from "mongoose";

const connectDb = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is missing");
  }

  await mongoose.connect(process.env.MONGO_URL);
  console.log("Db connected");
};

export default connectDb;
