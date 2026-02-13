# MongoDB MCP Server

A read-only [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for querying MongoDB databases. Designed to be used with MCP-compatible clients like Claude Code, Claude Desktop, etc.

## Setup

```bash
npm install
npm run build
```

Or run directly with npx:

```bash
MONGODB_URI="mongodb://localhost:27017" npx mongodb-mcp
```

## Environment Variables

| Variable      | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `MONGODB_URI` | Yes      | MongoDB connection string (e.g. `mongodb://localhost:27017` or `mongodb+srv://...`) |

Copy `.env.example` to `.env` and fill in your connection string.

## Configuration

The server requires a `MONGODB_URI` environment variable pointing to your MongoDB instance.

### Claude Code

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
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
      "command": "node",
      "args": ["/path/to/dist/index.js"],
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

### `run_aggregation`

Runs an aggregation pipeline on a collection.

| Parameter    | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `database`   | string   | The database name            |
| `collection` | string   | The collection name          |
| `pipeline`   | object[] | The aggregation pipeline stages |

## Safety

- **Read-only mode** — Write stages (`$out`, `$merge`) in aggregation pipelines are rejected with an error.
- **Read preference** — The connection uses `secondaryPreferred` read preference as defense in depth.

## Development

```bash
npm run dev    # watch mode
npm run build  # compile TypeScript
npm start      # run the compiled server
```

## License

MIT
