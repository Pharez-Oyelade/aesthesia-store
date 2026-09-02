import mongoose from "mongoose";

const DB =
  process.env.NODE_ENV === "development" ? "staging" : "store-recreate";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  await mongoose.connect(`${process.env.MONGODB_URL}/${DB}`);
};

export default connectDB;
