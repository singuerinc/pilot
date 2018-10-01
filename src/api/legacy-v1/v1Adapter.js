import map from "ramda/src/map";
import find from "ramda/src/find";
import compose from "ramda/src/compose";
import prop from "ramda/src/prop";
import propOr from "ramda/src/propOr";
import exampleREST from "../../exampleREST";
import { resolvers } from "../../resolvers";
import { typeIsAlpha, typeIsBeta, typeIsRelease } from "../releases";
import { buildCredentials } from "../../utils";
import config from "../../config";

export const getId = propOr("", "_id");
export const findAlpha = find(typeIsAlpha);
export const findBeta = find(typeIsBeta);
export const findLatest = find(typeIsRelease);
export const toISOString = (x) => new Date(x).toISOString();

export const serializeRelease = (raw) => ({
  version: prop("version")(raw),
  time: toISOString(raw.date),
  tarball: prop("tarball")(raw)
});

export const latestTags = (raw) => ({
  alpha: compose(
    serializeRelease,
    findAlpha
  )(raw),
  beta: compose(
    serializeRelease,
    findBeta
  )(raw),
  latest: compose(
    serializeRelease,
    findLatest
  )(raw)
});

export const serializeTags = (raw) => ({
  alpha: compose(
    getId,
    findAlpha
  )(raw),
  beta: compose(
    getId,
    findBeta
  )(raw),
  latest: compose(
    getId,
    findLatest
  )(raw)
});

export const serializeBranch = (x) => ({
  displayId: getId(x),
  // TODO: add all this info
  package: "",
  artifact: {
    time: "",
    version: "",
    tarball: ""
  }
});

export const artifacts = (api, packageName) =>
  api.allReleases(null, { packageName }).then(map(serializeRelease));

export const tags = (api, packageName) =>
  api.allReleaseTags(null, { packageName });

export const branches = (api, project, repo, credentials) =>
  api
    .allBranches(null, { project, repo }, { credentials })
    .then(map(serializeBranch));

export function fetch(
  npm,
  axios,
  artifacts,
  tags,
  branches,
  buildCredentials,
  serializeTags,
  packageName,
  project,
  repo
) {
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
        // ...exampleREST,
        artifacts: {
          tags: serializeTags(tags),
          versions
        },
        branches,
        project: {
          domain: "http://domain/", //FIXME: get this info from somewhere
          packageName,
          project,
          repo
        },
        tags: latestTags(tags)
      };
    })
    .catch(() => {
      return { error: 1 };
    });
}
