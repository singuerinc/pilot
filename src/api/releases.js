import always from "ramda/src/always";
import compose from "ramda/src/compose";
import cond from "ramda/src/cond";
import curry from "ramda/src/curry";
import descend from "ramda/src/descend";
import keys from "ramda/src/keys";
import map from "ramda/src/map";
import prop from "ramda/src/prop";
import reject from "ramda/src/reject";
import sortWith from "ramda/src/sortWith";
import T from "ramda/src/T";
import test from "ramda/src/test";
import values from "ramda/src/values";
import cfg from "../config";

export const npmConf = () => ({
  registry: cfg.NPM_REGISTRY
});
export const typeIsAlpha = (x) => x.type === "alpha";
export const isCreatedOrModified = (x) => x === "created" || x === "modified";

/**
 * Returns the type of a release tag.
 * @example
 * findTagType('0.1.0-beta.y04t1i8e'); // => 'beta'
 */
export const findTagType = cond([
  [test(/-alpha\./), always("alpha")],
  [test(/-beta\./), always("beta")],
  [T, always("release")]
]);

/**
 * Create an object version of a release mixing
 * timestamp, version, tag type, etc.
 * @param {string[]} versions
 * @param {object} timestamps
 * @param {object} version
 */
export const serialize = curry((versions, timestamps, version) => ({
  _id: version,
  version,
  date: new Date(timestamps[version]).getTime(),
  tarball: "", //versions[tag].dist.tarball,
  type: findTagType(version._id)
}));

/**
 * Creates a serialized version of each tag.
 * @param {() => boolean} typeIsAlphaFn
 * @param {string[]} versions
 * @param {object} timestamps
 */
export const parseReleaseTags = (typeIsAlphaFn, versions, timestamps) =>
  compose(
    // @ts-ignore
    map(serialize(versions, timestamps)),
    reject(typeIsAlphaFn),
    values
  );

/**
 * Creates a serialized version of each release.
 * @param {() => boolean} isCreatedOrModifiedFn
 * @param {string[]} versions
 * @param {object} timestamps
 */
export const parseAllReleases = (isCreatedOrModifiedFn, versions, timestamps) =>
  compose(
    sortWith([descend(prop("date"))]),
    // @ts-ignore
    map(serialize(versions, timestamps)),
    reject(isCreatedOrModifiedFn),
    keys
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
        console.log(err);
        if (err) {
          reject(err);
        } else {
          // Since the object has keys as index we need to extract the first one
          const f = keys(res)[0];
          resolve(res[f]);
        }
      });
    });
  });
};
