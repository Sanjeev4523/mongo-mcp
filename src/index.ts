#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MongoClient } from "mongodb";
import { z } from "zod/v4";

const MONGODB_URI = process.env["MONGODB_URI"];
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is required");
  process.exit(1);
}

const WRITE_STAGES = new Set(["$out", "$merge"]);

const client = new MongoClient(MONGODB_URI, {
  readPreference: "secondaryPreferred",
});
let connected = false;

async function ensureConnected() {
  if (!connected) {
    try {
      await client.connect();
      connected = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to connect to MongoDB: ${message}`);
    }
  }
}

const server = new McpServer({
  name: "mongodb-mcp",
  version: "1.0.0",
});

server.registerTool("list_databases", {
  description: "List all databases on the connected MongoDB instance",
}, async () => {
  await ensureConnected();
  const result = await client.db("admin").admin().listDatabases();
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result.databases, null, 2),
      },
    ],
  };
});

server.registerTool("list_collections", {
  description: "List all collections in a given database",
  inputSchema: { database: z.string().describe("The database name") },
}, async ({ database }) => {
  await ensureConnected();
  const collections = await client.db(database).listCollections().toArray();
  const names = collections.map((c) => c.name);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(names, null, 2),
      },
    ],
  };
});

server.registerTool("run_aggregation", {
  description: "Run an aggregation pipeline on a collection",
  inputSchema: {
    database: z.string().describe("The database name"),
    collection: z.string().describe("The collection name"),
    pipeline: z.array(z.record(z.string(), z.any())).describe("The aggregation pipeline stages"),
  },
}, async ({ database, collection, pipeline }) => {
    const writeStage = pipeline.find((stage) =>
      Object.keys(stage).some((key) => WRITE_STAGES.has(key)),
    );
    if (writeStage) {
      const stageName = Object.keys(writeStage).find((k) => WRITE_STAGES.has(k));
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: Write operation "${stageName}" is not allowed. This server operates in read-only mode.`,
          },
        ],
        isError: true,
      };
    }

    await ensureConnected();
    const results = await client
      .db(database)
      .collection(collection)
      .aggregate(pipeline)
      .toArray();
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
});

process.on("SIGINT", async () => {
  if (connected) {
    await client.close();
  }
  process.exit(0);
});

const transport = new StdioServerTransport();
await server.connect(transport);
