import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect("mongodb://localhost:27017", {
      dbName: "StripeConnect",
    });
    console.log(`Mongodb is connected with ${connection.host}`);
  } catch (error) {
    console.log(`Failed to connect mongodb: ${error}`);
  }
};

export { connectDb };
