# MongoDB MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with MongoDB databases.

## Stack

- **TypeScript** — strict mode, ES modules
- **@modelcontextprotocol/sdk** (v1.26.0) — MCP server framework
- **mongodb** (v7.1.0) — official MongoDB driver
- **zod** — input validation for tool schemas

## Tools

- `list_databases` — list all databases on the connected MongoDB instance
- `list_collections` — list all collections in a given database
- `run_aggregation` — run an aggregation pipeline on a collection

## Project Structure

```
src/
  index.ts        — entry point, MCP server setup and transport
```

## Scripts

- `npm run build` — compile TypeScript to `dist/`
- `npm run dev` — watch mode
- `npm start` — run the compiled server

## Connection

The server connects to MongoDB via a connection string passed as an environment variable or argument (TBD).
