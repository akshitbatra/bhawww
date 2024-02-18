import express from "express";
import morgan from "morgan";
import schema from "./schema";
const expressPlayground = require('graphql-playground-middleware-express')
  .default


var { createHandler } = require("graphql-http/lib/use/express");
const app: express.Application = express();
const port = 3000;
app.use(morgan("combined"));

var root = {
  hello: () => {
    return "Hello world!";
  },
};

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
