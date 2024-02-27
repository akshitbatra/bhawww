import express from "express";
import morgan from "morgan";
import resolver from "./src/resolver";
import schema from "./src/schema";
import { createHandler } from "graphql-http/lib/use/express";
const expressPlayground = require('graphql-playground-middleware-express')
  .default

const app: express.Application = express();
const port = 3000;
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5433,
})

app.use(express.json());
app.use(morgan("combined"));

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: resolver,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js Express!");
});

app.get("/users", (req, res)=> {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error: any, results: { rows: any; }) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.post("/user", (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error: any, results: { rows: { id: any; }[]; }) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
});

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
