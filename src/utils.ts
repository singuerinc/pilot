import * as R from "ramda";
import cfg from "./config";

/**
 * Converts an object to a query string
 * @example
 * paramsToQuery({ foo: "bar", key: "value" }); // => "?foo=bar&key=value"
 */
export const paramsToQuery = R.compose(
  R.join(""),
  R.ifElse(R.equals(1), R.prepend("?"), R.always([])),
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
 */
export const buildCredentials = (username: string, password: string) =>
  Buffer.from(`${username}:${password}`, "ascii").toString("base64");

/**
 * Returns the url to get the branches info
 */
export const branchesUrl = (project: string, repo: string) =>
  R.compose(
    R.replace("%project%", project),
    R.replace("%repo%", repo)
  )(cfg.BRANCHES_URL);

/**
 * Returns the url to get the commits info
 */
export const commitsUrl = (
  project: string,
  repo: string,
  { limit }: { limit: number }
) =>
  R.compose(
    R.flip(R.concat)(paramsToQuery({ limit })),
    R.replace("%project%", project),
    R.replace("%repo%", repo)
  )(cfg.COMMITS_URL);
