import * as cors from "cors";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import cfg from "./config";
import schema from "./schema";
import { buildCredentials } from "./utils";
import * as routes from "./routes";

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

app.use("/api/1.0/dashboard", routes.v1_dashboard);

app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`);
});
