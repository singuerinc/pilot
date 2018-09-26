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

/**
 * Converts an object to a query string
 * @example
 * paramsToQuery({ foo: "bar", key: "value" }); // => "?foo=bar&key=value"
 */
export const paramsToQuery = compose(
  join(""),
  ifElse(length, prepend("?"), always([])),
  join("&"),
  map(join("=")),
  toPairs
);

/**
 * Creates a http header object
 */
export const headers = compose(
  assocPath(["headers", "common", "Authorization"], __, {}),
  concat("Basic ")
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
  compose(
    replace("%project%", project),
    replace("%repo%", repo)
  )(cfg.BRANCHES_URL);

/**
 * Returns the url to get the commits info
 * @param {string} project
 * @param {string} repo
 * @param {object} options
 */
export const commitsUrl = (project, repo, { limit }) =>
  compose(
    concat(__, paramsToQuery({ limit })),
    replace("%project%", project),
    replace("%repo%", repo)
  )(cfg.COMMITS_URL);
