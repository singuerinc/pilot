import * as R from "ramda";
import cfg from "../config";

interface IRelease {
  type: string;
}

interface ITimestamp {
  created: string;
  modified: string;
  [version: string]: string;
}

export const npmConf = () => ({
  registry: cfg.NPM_REGISTRY
});

export function typeIsAlpha(release: IRelease) {
  return R.compose<IRelease, string, boolean>(
    R.equals("alpha"),
    R.prop("type")
  )(release);
}

export function typeIsBeta(release: IRelease) {
  return R.compose<IRelease, string, boolean>(
    R.equals("beta"),
    R.prop("type")
  )(release);
}

export const typeIsRelease = (x: IRelease) => !typeIsAlpha(x) && !typeIsBeta(x);
export const isCreatedOrModified = (x: string) =>
  x === "created" || x === "modified";

/**
 * Returns the type of a release tag.
 * @example
 * findTagType('0.1.0-beta.y04t1i8e'); // => 'beta'
 */
export const findTagType = R.cond([
  [R.test(/-alpha\./), R.always("alpha")],
  [R.test(/-beta\./), R.always("beta")],
  [R.T, R.always("release")]
]);

/**
 * Create an object version of a release mixing
 * timestamp, version, tag type, etc.
 */
export const serialize = R.curry(
  (versions: string[], timestamps: ITimestamp, version: string) => ({
    _id: version,
    version,
    date: new Date(timestamps[version]).getTime(),
    tarball: "", //versions[tag].dist.tarball,
    type: findTagType(version)
  })
);

/**
 * Creates a serialized version of each tag.
 */
export const parseReleaseTags = (
  typeIsAlphaFn: (x: IRelease) => boolean,
  versions: string[],
  timestamps: ITimestamp
) =>
  R.compose(
    R.map(serialize(versions, timestamps)),
    R.reject(typeIsAlphaFn),
    R.values
  );

/**
 * Creates a serialized version of each release.
 */
export const parseAllReleases = (
  isCreatedOrModifiedFn,
  versions: string[],
  timestamps: ITimestamp
) =>
  R.compose(
    R.sortWith([R.descend(R.prop("date"))]),
    R.map(serialize(versions, timestamps)),
    R.reject(isCreatedOrModifiedFn),
    R.keys
  );

/**
 * Loads the package information from the registry.
 * The response from the service looks similar to this one:
 * {
 *   '2.2.0': {
 *     _id: 'x@2.2.0',
 *     name: 'x',
 *     'dist-tags': {
 *       latest: '2.2.0'
 *     },
 *     versions : ['1.0.0', '1.0.1', '1.1.0', ...],
 *     time : {
 *       created: '2018-05-18T09:01:38.604Z',
 *       '1.0.0': '2018-05-18T09:01:38.604Z',
 *       modified: '2018-05-18T09:01:38.604Z',
 *       ...
 *     },
 *   }
 * }
 */
export const load = async (npm, name: string) => {
  const res = await npm.packument(name);
  return res;
};
