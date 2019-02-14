import * as R from "ramda";
import config from "../../config";
import { resolvers, API } from "../../resolvers";
import { typeIsAlpha, typeIsBeta, typeIsRelease, IRelease } from "../releases";
import { AxiosStatic } from "axios";

export interface IBranchV1 {
  displayId: string;
  package: string;
  artifact: {
    time: string;
    version: string;
    tarball: string;
  };
}

export interface IReleaseV1 {
  time: string;
  version: string;
  tarball: string;
}

export interface ITag {
  _id: string;
  type: "alpha" | "beta" | "latest";
}

export interface ILatestTags {
  alpha: ITag;
  beta: ITag;
  latest: ITag;
}

export interface ITags {
  alpha: string;
  beta: string;
  latest: string;
}

export const getId = R.propOr("", "_id");
export const findAlpha = R.find(typeIsAlpha);
export const findBeta = R.find(typeIsBeta);
export const findLatest = R.find(typeIsRelease);
export const findAndGetId = (predicate: (list: IRelease[]) => IRelease) =>
  R.compose(
    getId,
    predicate
  );

export const findAndSerialize = (predicate: (list: IRelease[]) => IRelease) =>
  R.compose(
    serializeRelease,
    predicate
  );

export const toISOString = (x: string) => new Date(x).toISOString();

export const serializeRelease = R.applySpec<IReleaseV1>({
  version: R.prop("version"),
  time: R.compose(
    toISOString,
    R.prop("date")
  ),
  tarball: R.prop("tarball")
});

export const latestTags = R.applySpec<ILatestTags>({
  alpha: findAndSerialize(findAlpha),
  beta: findAndSerialize(findBeta),
  latest: findAndSerialize(findLatest)
});

export const serializeTags = R.applySpec<ITags>({
  alpha: findAndGetId(findAlpha),
  beta: findAndGetId(findBeta),
  latest: findAndGetId(findLatest)
});

export const serializeBranch = R.applySpec<IBranchV1>({
  displayId: getId,
  // TODO: add all this info
  package: R.always(""),
  artifact: {
    time: R.always(""),
    version: R.always(""),
    tarball: R.always("")
  }
});

export const artifacts = (api: API, packageName: string) =>
  api.allReleases(null, { packageName }).then(R.map(serializeRelease));

export const tags = (api: API, packageName: string) =>
  api.allReleaseTags(null, { packageName });

export const branches = (
  api: API,
  project: string,
  repo: string,
  credentials: string
) =>
  api
    .allBranches(null, { project, repo }, { credentials })
    .then(R.map(serializeBranch));

export function fetch(
  npm,
  axios: AxiosStatic,
  artifacts,
  tags,
  branches,
  buildCredentials: (username: string, password: string) => string,
  serializeTags,
  packageName: string,
  project: string,
  repo: string
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
