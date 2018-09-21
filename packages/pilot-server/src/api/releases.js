import npm from 'npm';
import {
  compose,
  descend,
  keys,
  map,
  prop,
  reject,
  sortWith,
  values
} from 'ramda';

const npmConf = {
  registry: 'https://registry.npmjs.org/'
};

const sortByDate = sortWith([descend(prop('date'))]);

const isAlpha = x => x.type === 'alpha';
const isNotRelease = x => x === 'created' || x === 'modified';

const isAlphaTag = x => /-alpha\./.test(x);
const isBetaTag = x => /-beta\./.test(x);
const typeByTag = x =>
  isAlphaTag(x) ? 'alpha' : isBetaTag(x) ? 'beta' : 'release';

const Release = (time, versions) => version => ({
  _id: version,
  version,
  date: new Date(time[version]).getTime(),
  tarball: '', //versions[version].dist.tarball,
  type: typeByTag(version)
});

const load = async name => {
  return new Promise((resolve, reject) => {
    npm.load(npmConf, () => {
      const callback = (success, ups) => (err, res) => {
        if (err) {
          ups(err);
        } else {
          const f = keys(res)[0];
          success(res[f]);
        }
      };
      npm.commands.view([name], true, callback(resolve, reject));
    });
  });
};

const tags = async ({ packageName }) => {
  const data = await load(packageName);
  const { versions, time } = data;

  const toRelease = Release(time, versions);

  const parse = compose(
    reject(isAlpha),
    map(toRelease),
    values
  );

  return parse(data['dist-tags']);
};

const find = async ({ packageName }) => {
  const { versions, time } = await load(packageName);

  const artifacts = reject(isNotRelease)(keys(time));

  const parse = compose(
    sortByDate,
    map(Release(time, versions))
  );

  return parse(artifacts);
};

export {
  tags,
  find,
  isAlpha,
  isNotRelease,
  sortByDate,
  Release,
  typeByTag,
  load
};
