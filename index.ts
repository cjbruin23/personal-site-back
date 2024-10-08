import express, { Request, Response } from "express";
import dotenv from "dotenv";
var cors = require('cors');

// configures dotenv to work in your application
dotenv.config();
const app = express();
app.use(cors())

const PORT = process.env.PORT;

app.get("/", (_request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
})