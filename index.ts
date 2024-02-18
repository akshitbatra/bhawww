import express from "express";
import morgan from "morgan";
import resolver from "./src/resolver";
import schema from "./src/schema";
import { createHandler } from "graphql-http/lib/use/express";
const expressPlayground = require('graphql-playground-middleware-express')
  .default

const app: express.Application = express();
const port = 3000;
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

app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
