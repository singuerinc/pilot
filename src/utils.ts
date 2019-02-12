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

export interface IHeaders {
  headers?: { common: { Authorization: string } };
}

/**
 * Creates a http header object
 */
export function headers(x: string): IHeaders {
  //@ts-ignore
  return R.compose(
    R.assocPath(["headers", "common", "Authorization"], R.__, {}),
    R.concat("Basic ")
  )(x);
}

/**
 * Creates a base 64 string with the username/password
 */
export function buildCredentials(username: string, password: string) {
  return Buffer.from(`${username}:${password}`, "ascii").toString("base64");
}

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
