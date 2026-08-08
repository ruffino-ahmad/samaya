import { QueueClient } from "@azure/storage-queue";
import { QUEUE_CONNECTION_STRING } from "../utils/env.js";

const connectionString = QUEUE_CONNECTION_STRING as string;

if (!connectionString) {
  throw new Error(
    "QUEUE_CONNECTION_STRING is not defined in the environment variables.",
  );
}

const queueClient = new QueueClient(connectionString, "email-activation-queue");

export default queueClient;
