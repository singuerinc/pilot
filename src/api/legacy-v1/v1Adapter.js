import always from "ramda/src/always";
import applySpec from "ramda/src/applySpec";
import compose from "ramda/src/compose";
import find from "ramda/src/find";
import map from "ramda/src/map";
import prop from "ramda/src/prop";
import propOr from "ramda/src/propOr";
import config from "../../config";
import { resolvers } from "../../resolvers";
import { typeIsAlpha, typeIsBeta, typeIsRelease } from "../releases";

export const getId = propOr("", "_id");
export const findAlpha = find(typeIsAlpha);
export const findBeta = find(typeIsBeta);
export const findLatest = find(typeIsRelease);
export const findAndGetId = (predicate) =>
  compose(
    getId,
    predicate
  );
export const findAndSerialize = (predicate) =>
  compose(
    serializeRelease,
    predicate
  );
export const toISOString = (x) => new Date(x).toISOString();

export const serializeRelease = applySpec({
  version: prop("version"),
  time: compose(
    toISOString,
    prop("date")
  ),
  tarball: prop("tarball")
});

export const latestTags = applySpec({
  alpha: findAndSerialize(findAlpha),
  beta: findAndSerialize(findBeta),
  latest: findAndSerialize(findLatest)
});

export const serializeTags = applySpec({
  alpha: findAndGetId(findAlpha),
  beta: findAndGetId(findBeta),
  latest: findAndGetId(findLatest)
});

export const serializeBranch = applySpec({
  displayId: getId,
  // TODO: add all this info
  package: always(""),
  artifact: {
    time: always(""),
    version: always(""),
    tarball: always("")
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
      return {
        artifacts: {
          tags: serializeTags(tags),
          versions
        },
        branches,
        pullRequests: {},
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
