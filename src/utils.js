import always from "ramda/src/always";
import assocPath from "ramda/src/assocPath";
import compose from "ramda/src/compose";
import concat from "ramda/src/concat";
import ifElse from "ramda/src/ifElse";
import join from "ramda/src/join";
import length from "ramda/src/length";
import map from "ramda/src/map";
import prepend from "ramda/src/prepend";
import replace from "ramda/src/replace";
import toPairs from "ramda/src/toPairs";
import __ from "ramda/src/__";
import cfg from "./config";

export const paramsToQuery = compose(
  join(""),
  ifElse(length, prepend("?"), always([])),
  join("&"),
  map(join("=")),
  toPairs
);

export const headers = compose(
  assocPath(["headers", "common", "Authorization"], __, {}),
  concat("Basic ")
);

export const buildCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, "ascii").toString("base64");

export const branchesUrl = (project, repo) =>
  compose(
    replace("%project%", project),
    replace("%repo%", repo)
  )(cfg.BITBUCKET_BRANCHES_URL);

export const commitsUrl = (project, repo, { limit }) =>
  compose(
    concat(__, paramsToQuery({ limit })),
    replace("%project%", project),
    replace("%repo%", repo)
  )(cfg.BITBUCKET_COMMITS_URL);
