import * as R from "ramda";
import cfg from "../config";

export const npmConf = () => ({
  registry: cfg.NPM_REGISTRY
});

export const typeIsAlpha = R.compose(
  R.equals("alpha"),
  R.prop("type")
);

export const typeIsBeta = R.compose(
  R.equals("beta"),
  R.prop("type")
);

export const typeIsRelease = (x) => !typeIsAlpha(x) && !typeIsBeta(x);
export const isCreatedOrModified = (x) => x === "created" || x === "modified";

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
 * @param {string[]} versions
 * @param {object} timestamps
 * @param {object} version
 */
export const serialize = R.curry((versions, timestamps, version) => ({
  _id: version,
  version,
  time: timestamps[version],
  date: new Date(timestamps[version]).getTime(),
  tarball: versions[0],
  type: findTagType(version)
}));

/**
 * Creates a serialized version of each tag.
 * @param {Function} typeIsAlphaFn
 * @param {string[]} versions
 * @param {object} timestamps
 */
export const parseReleaseTags = (typeIsAlphaFn, versions, timestamps) =>
  R.compose(
    R.map(serialize(versions, timestamps)),
    R.reject(typeIsAlphaFn),
    R.values
  );

/**
 * Creates a serialized version of each release.
 * @param {Function} isCreatedOrModifiedFn
 * @param {string[]} versions
 * @param {object} timestamps
 */
export const parseAllReleases = (isCreatedOrModifiedFn, versions, timestamps) =>
  R.compose(
    R.sortWith([R.descend(R.prop("date"))]),
    // R.tap(console.log.bind(console)),
    R.map(serialize(versions, timestamps)),
    R.reject(isCreatedOrModifiedFn),
    // R.map(R.tap(console.log.bind(console))),
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
 * @param {*} npm
 * @param {string} name The package name
 */
export const load = async (npm, name) => {
  return new Promise((resolve, reject) => {
    // TODO: move this npmConf to params
    npm.load(npmConf(), () => {
      // @ts-ignore
      npm.commands.view([name], true, (err, res) => {
        if (err) {
          reject(err);
        } else {
          // Since the object has keys as index we need to extract the first one
          const f = R.head(R.keys(res));
          resolve(res[f]);
        }
      });
    });
  });
};
