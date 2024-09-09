import express, { Request, Response } from "express";
import dotenv from "dotenv";
var cors = require("cors");
import { Kysely, PostgresDialect } from "kysely";
import { Client, Pool } from "pg";
import { Database } from "./src/types";
const fs = require('fs');

// configures dotenv to work in your application
dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT;

let dialect: PostgresDialect;
let db: Kysely<Database>;

try {
  dialect = new PostgresDialect({
    pool: async () =>
      new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          ca: fs.readFileSync('./ca.crt').toString(),
        },
      })
  });

  db = new Kysely<Database>({
    dialect,
  });

  console.log("db", db);
} catch (e) {
  console.error(e);
}

app.get("/", async (_request: Request, response: Response) => {
  const result = await db.selectFrom('stories')
  .selectAll()
  .executeTakeFirst();
  console.log('result', result)

  response.status(200).send("Connected to Server");
});

app.post("/story", (request: Request, response: Response) => {
  console.log("request", request);
  response.status(201).send("hitting story endpoint");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
