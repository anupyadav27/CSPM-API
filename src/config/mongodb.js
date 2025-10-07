import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME;

    if (!uri || !dbName) {
      throw new Error("MongoDB URI or database name not set in environment variables.");
    }

    await mongoose.connect(uri, {
      dbName,
    });

    console.log(`MongoDB connected to database: ${dbName}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectMongoDB();
