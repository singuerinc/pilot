import R from "ramda";

export const paramsToQuery = R.compose(
  R.join(""),
  R.ifElse(R.length, R.prepend("?"), R.always([])),
  R.join("&"),
  R.map(R.join("=")),
  R.toPairs
);

export const headers = R.compose(
  R.assocPath(["headers", "common", "Authorization"], R.__, {}),
  R.concat("Basic ")
);

export const buildCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, "ascii").toString("base64");

// FIXME: out!
export const branchesUrl = (project, repo) =>
  `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/branches`;

// FIXME: hard coded urls are always bad, get from config
export const commitsUrl = (project, repo, { limit }) =>
  `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/commits${paramsToQuery(
    { limit }
  )}`;
