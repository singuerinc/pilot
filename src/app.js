import cors from "cors";
import express from "express";
import graphqlHTTP from "express-graphql";
import cfg from "./config";
import schema from "./schema";
import { buildCredentials } from "./utils";

const app = express();
const PORT = process.env.PORT || 3000;
const credentials = buildCredentials(cfg.USERNAME, cfg.PASSWORD);

app.use(cors());
app.options("/graphql", cors());
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    context: {
      credentials
    }
  })
);

app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`);
});
