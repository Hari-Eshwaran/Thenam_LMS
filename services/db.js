import mongoose from "mongoose";

export async function connectDatabase({ mongoUri, dbName }) {
  mongoose.set("strictQuery", true);
  mongoose.set("autoIndex", process.env.NODE_ENV !== "production");

  mongoose.connection.on("error", (error) => {
    console.error("[mongo:error]", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[mongo] disconnected");
  });

  await mongoose.connect(mongoUri, {
    dbName,
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 20,
  });
  return mongoose.connection;
}
