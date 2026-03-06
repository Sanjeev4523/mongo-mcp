# MongoDB MCP Server

[![npm version](https://img.shields.io/npm/v/mongodb-mcp.svg)](https://www.npmjs.com/package/mongodb-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A read-only [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for querying MongoDB databases. Designed to be used with MCP-compatible clients like Claude Code, Claude Desktop, etc.

## Quick Start

Run directly with npx — no installation needed:

```bash
MONGODB_URI="mongodb://localhost:27017" npx mongodb-mcp
```

Or install globally:

```bash
npm install -g mongodb-mcp
```

## Environment Variables

| Variable      | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `MONGODB_URI` | Yes      | MongoDB connection string (e.g. `mongodb://localhost:27017` or `mongodb+srv://...`) |

## Configuration

### Claude Code

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": ["mongodb-mcp"],
      "env": {
        "MONGODB_URI": "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": ["mongodb-mcp"],
      "env": {
        "MONGODB_URI": "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
      }
    }
  }
}
```

## Tools

### `list_databases`

Lists all databases on the connected MongoDB instance.

### `list_collections`

Lists all collections in a given database.

| Parameter  | Type   | Description       |
| ---------- | ------ | ----------------- |
| `database` | string | The database name |

### `list_indexes`

Lists all indexes on a collection.

| Parameter    | Type   | Description         |
| ------------ | ------ | ------------------- |
| `database`   | string | The database name   |
| `collection` | string | The collection name |

### `run_aggregation`

Runs an aggregation pipeline on a collection.

| Parameter    | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `database`   | string   | The database name            |
| `collection` | string   | The collection name          |
| `pipeline`   | object[] | The aggregation pipeline stages |

### `run_aggregation_to_file`

Runs an aggregation pipeline and writes results to a JSON file on disk instead of returning them over MCP. Returns only metadata (document count, file path, file size), which avoids loading large result sets into the agent's context window. Use CLI tools like `jq`, `head`, or the `Read` tool to selectively inspect the output file.

| Parameter     | Type     | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `database`    | string   | The database name                                |
| `collection`  | string   | The collection name                              |
| `pipeline`    | object[] | The aggregation pipeline stages                  |
| `output_path` | string   | Absolute file path where JSON results are written |

## Safety

- **Read-only mode** — Write stages (`$out`, `$merge`) in aggregation pipelines are rejected with an error.
- **Query timeout** — Aggregation queries have a 50-second server-side timeout (`maxTimeMS`) to prevent runaway queries.
- **Read preference** — The connection uses `secondaryPreferred` read preference as defense in depth.

## Development

```bash
npm run dev    # watch mode
npm run build  # compile TypeScript
npm start      # run the compiled server
```

## License

MIT
