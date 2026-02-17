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
    if (cachedConnection.mongooseConnection.connection.readyState === 1) {
      return cachedConnection.mongooseConnection;
    }
    // Consider it stale if not connected/connecting
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (cachedConnection.mongooseConnection.connection.readyState === 0) {
      cachedConnection.mongooseConnection = null;
    }
    // If connecting (2), let it finish returning the promise/connection
  }

  try {
    // If a connection is already in progress, avoid multiple invites
    if (!cachedConnection.promise) {
      const opts = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of default 30s
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip IPv6
        bufferCommands: true, // Let Mongoose buffer model commands
      };

      cachedConnection.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
        return mongoose;
      });
    }

    cachedConnection.mongooseConnection = await cachedConnection.promise;
    return cachedConnection.mongooseConnection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    cachedConnection.promise = null; // Reset promise on failure
    cachedConnection.mongooseConnection = null;
    throw error;
  }
}

export default connectToDatabase;
