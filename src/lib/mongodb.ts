import mongoose from "mongoose";

const MONGODB_URI = process.env.connection_string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedConnection = global as any;

if (!cachedConnection.mongooseConnection) {
  cachedConnection.mongooseConnection = null;
}

export async function connectToDatabase() {
  if (cachedConnection.mongooseConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection.mongooseConnection;
  }

  try {
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(MONGODB_URI as string);
    cachedConnection.mongooseConnection = connection;
    console.log("✅ MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}
