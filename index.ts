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

// try {
//   console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
//   dialect = new PostgresDialect({
//     pool: async () =>
//       new Pool({
//         user: "postgres",
//         password: "ePihHTRt1nQ3Flmr",
//         host: "pugnaciously-true-zorilla.data-1.use1.tembo.io",
//         port: 5432,
//         database: "postgres",
//       }),
//   });

//   db = new Kysely<Database>({
//     dialect,
//   });

//   console.log("db", db);
// } catch (e) {
//   console.error(e);
// }
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		ca: fs.readFileSync('./ca.crt').toString(),
	},
});

async function testQuery() {
	const client = await pool.connect();
	try {
		const response = await client.query('SELECT * from stories');
		console.log(response.rows[0]);
	} finally {
		client.release();
	}
}

testQuery();

app.get("/", (_request: Request, response: Response) => {
  // client.query('SELECT * FROM stories', (err, result) => {
  //   if (err) {
  //     console.error('Error executing query', err);
  //   } else {
  //     console.log('Query result:', result.rows);
  //   }
  // });
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
