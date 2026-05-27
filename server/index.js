import dotenv from "dotenv";
import http from "node:http";
import { getServerEnv } from "../services/env.js";
import { connectDatabase } from "../services/db.js";
import { createApp } from "./app.js";
import { initializeNotificationBroker } from "./notifications/notificationBroker.js";
import { startBackgroundJobs } from "./jobs/scheduler.js";
import { initializeSocketHub } from "./sockets/socketHub.js";

dotenv.config();

const config = getServerEnv(process.env);
const app = createApp();
const server = http.createServer(app);

async function start() {
  try {
    const connection = await connectDatabase({
      mongoUri: config.mongoUri,
      dbName: config.dbName,
    });
    console.log("MongoDB connection established.");
    console.log(`Database: ${connection.name}`);

    initializeNotificationBroker();
    startBackgroundJobs();
    await initializeSocketHub(server, { corsOrigin: true });

    process.on("unhandledRejection", (error) => {
      console.error("[process:unhandledRejection]", error);
    });

    process.on("uncaughtException", (error) => {
      console.error("[process:uncaughtException]", error);
    });

    server.listen(config.port, () => {
      console.log(`API server running on port ${config.port} (${config.nodeEnv}).`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error);
    process.exit(1);
  }
}

start();
