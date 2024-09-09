import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "./src/types";
import fs from "fs";

var cors = require("cors");

// configures dotenv to work in your application
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

let dialect: PostgresDialect;
let db: Kysely<Database>;

try {
  dialect = new PostgresDialect({
    pool: async () =>
      new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          ca: fs.readFileSync("./ca.crt").toString(),
        },
      }),
  });

  db = new Kysely<Database>({
    dialect,
  });
} catch (e) {
  console.error(e);
}

app.get("/", (_request: Request, response: Response) => {
  response.status(200).send("Connected to Server");
});

app.post("/story", async (_request: Request, response: Response) => {
  const body = _request.body;
  try {
    const storyExists = await db
      .selectFrom("stories")
      .where("name", "=", body.name)
      .executeTakeFirst();
    
      if (storyExists) {
      response.status(409).send("Book title already exists");
    } else {
      const result = await db
        .insertInto("stories")
        .values(_request.body)
        .executeTakeFirst();
      response.status(201).send("hitting story endpoint");
    }
  
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send("Error creating record. Check server for more details");
  }
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
