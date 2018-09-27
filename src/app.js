import axios from "axios";
import npm from "npm";
import cors from "cors";
import map from "ramda/src/map";
import express from "express";
import graphqlHTTP from "express-graphql";
import cfg from "./config";
import schema from "./schema";
import exampleREST from "./exampleREST";
import { buildCredentials } from "./utils";
import { resolvers } from "./resolvers";

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

const api = resolvers(npm, axios).Query;

app.use("/api/1.0/dashboard", async (req, res) => {
  const data = api
    .allReleases(null, {
      packageName: "@scope/package"
    })
    .then((artifactsRaw) => {
      return map(
        (x) => ({
          version: x.version,
          time: new Date(x.date).toISOString(),
          tarball: x.tarball
        }),
        artifactsRaw
      );
    })
    // .then(console.log)
    .then((artifacts_versions) =>
      res.json({
        ...exampleREST,
        artifacts: {
          ...exampleREST.artifacts,
          versions: artifacts_versions
        }
      })
    )
    .catch((e) => res.json({ error: 1 }));
});

app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`);
});
