import express from "express";
import morgan from "morgan";
const expressPlayground = require('graphql-playground-middleware-express')
  .default

var { buildSchema } = require("graphql");

var { createHandler } = require("graphql-http/lib/use/express");

const app: express.Application = express();
const port = 3000;
app.use(morgan("combined"));

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!";
  },
};

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Node.js Express!");
});

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
