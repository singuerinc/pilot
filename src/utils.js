import * as R from "ramda";
import cfg from "./config";

/**
 * Converts an object to a query string
 * @example
 * paramsToQuery({ foo: "bar", key: "value" }); // => "?foo=bar&key=value"
 */
export const paramsToQuery = R.compose(
  R.join(""),
  R.ifElse(R.length, R.prepend("?"), R.always([])),
  R.join("&"),
  R.map(R.join("=")),
  R.toPairs
);

/**
 * Creates a http header object
 */
export const headers = R.compose(
  R.assocPath(["headers", "common", "Authorization"], R.__, {}),
  R.concat("Basic ")
);

/**
 * Creates a base 64 string with the username/password
 * @param {string} username
 * @param {string} password
 */
export const buildCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, "ascii").toString("base64");

/**
 * Returns the url to get the branches info
 * @param {string} project
 * @param {string} repo
 */
export const branchesUrl = (project, repo) =>
  R.compose(
    R.replace("%project%", project),
    R.replace("%repo%", repo)
  )(cfg.BRANCHES_URL);

/**
 * Returns the url to get the commits info
 * @param {string} project
 * @param {string} repo
 * @param {object} options
 */
export const commitsUrl = (project, repo, { limit }) =>
  R.compose(
    R.concat(R.__, paramsToQuery({ limit })),
    R.replace("%project%", project),
    R.replace("%repo%", repo)
  )(cfg.COMMITS_URL);
