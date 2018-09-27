import map from "ramda/src/map";
import exampleREST from "../../exampleREST";
import { resolvers } from "../../resolvers";
import { typeIsAlpha, typeIsBeta, typeIsRelease } from "../releases";
import { buildCredentials } from "../../utils";
import config from "../../config";

const serializeRelease = (raw) => ({
  version: raw.version,
  time: new Date(raw.date).toISOString(),
  tarball: raw.tarball
});

const serializeTags = (raw) => ({
  // FIXME: what if there is no item found, crash!
  alpha: raw.find(typeIsAlpha)._id,
  beta: raw.find(typeIsBeta)._id,
  latest: raw.find(typeIsRelease)._id
});

const serializeBranch = (x) => ({
  displayId: x._id,
  // TODO: add all this info
  package: "",
  artifact: {
    time: "",
    version: "",
    tarball: ""
  }
});

const artifacts = (api, packageName) =>
  api.allReleases(null, { packageName }).then(map(serializeRelease));

const tags = (api, packageName) => api.allReleaseTags(null, { packageName });

const branches = (api, project, repo, credentials) =>
  api
    .allBranches(null, { project, repo }, { credentials })
    .then(serializeBranch);

function fetch(npm, axios, packageName, project, repo) {
  const api = resolvers(npm, axios).Query;
  const calls = Promise.all([
    artifacts(api, packageName),
    tags(api, packageName),
    branches(
      api,
      project,
      repo,
      buildCredentials(config.USERNAME, config.PASSWORD)
    )
  ]);

  return calls
    .then(([versions, tags, branches]) => {
      console.log(tags);
      return {
        ...exampleREST,
        artifacts: {
          tags: serializeTags(tags),
          versions
        }
      };
    })
    .catch(() => {
      return { error: 1 };
    });
}

export { fetch };
