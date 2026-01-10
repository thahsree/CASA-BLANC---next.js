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
    // Verify connection is still active
    if (cachedConnection.mongooseConnection.connection.readyState === 1) {
      return cachedConnection.mongooseConnection;
    } else {
      console.log("Cached connection is stale, reconnecting...");
      cachedConnection.mongooseConnection = null;
    }
  }

  try {
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(MONGODB_URI as string, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 45000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: "majority",
    });
    
    cachedConnection.mongooseConnection = connection;
    console.log("✅ MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    cachedConnection.mongooseConnection = null;
    throw error;
  }
}
