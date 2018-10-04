import * as R from "ramda";
import config from "../../config";
import { resolvers } from "../../resolvers";
import { typeIsAlpha, typeIsBeta, typeIsRelease } from "../releases";

export const getId = R.propOr("", "_id");
export const findAlpha = R.find(typeIsAlpha);
export const findBeta = R.find(typeIsBeta);
export const findLatest = R.find(typeIsRelease);
export const findAndGetId = (predicate) =>
  R.compose(
    getId,
    predicate
  );
export const findAndSerialize = (predicate) =>
  R.compose(
    serializeRelease,
    predicate
  );
export const toISOString = (x) => new Date(x).toISOString();

export const serializeRelease = R.applySpec({
  version: R.prop("version"),
  time: R.compose(
    toISOString,
    R.prop("date")
  ),
  tarball: R.prop("tarball")
});

export const latestTags = R.applySpec({
  alpha: findAndSerialize(findAlpha),
  beta: findAndSerialize(findBeta),
  latest: findAndSerialize(findLatest)
});

export const serializeTags = R.applySpec({
  alpha: findAndGetId(findAlpha),
  beta: findAndGetId(findBeta),
  latest: findAndGetId(findLatest)
});

export const serializeBranch = R.applySpec({
  displayId: getId,
  // TODO: add all this info
  package: R.always(""),
  artifact: {
    time: R.always(""),
    version: R.always(""),
    tarball: R.always("")
  }
});

export const artifacts = (api, packageName) =>
  api.allReleases(null, { packageName }).then(R.map(serializeRelease));

export const tags = (api, packageName) =>
  api.allReleaseTags(null, { packageName });

export const branches = (api, project, repo, credentials) =>
  api
    .allBranches(null, { project, repo }, { credentials })
    .then(R.map(serializeBranch));

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
        project: {
          domain: "http://domain/", //FIXME: get this info from somewhere
          packageName,
          project,
          repo
        },
        branches,
        tags: latestTags(tags),
        artifacts: {
          tags: serializeTags(tags),
          versions: R.take(10, versions) //FIXME: should take all. not 10
        },
        pullRequests: {}
      };
    })
    .catch((e) => {
      console.log(e);
      return { error: 1 };
    });
}
