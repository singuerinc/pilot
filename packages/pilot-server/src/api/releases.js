import npm from 'npm';
import * as R from 'ramda';

const npmConf = {
  registry: 'https://registry.npmjs.org/'
};

const releaseIsAlpha = R.compose(
  R.equals('alpha'),
  R.prop('type')
);

const notVersionNum = R.either(R.equals('created'), R.equals('modified'));
const isAlphaTag = R.test(/-alpha\./);
const isBetaTag = R.test(/-beta\./);

const typeByTag = R.cond([
  [isAlphaTag, R.always('alpha')],
  [isBetaTag, R.always('beta')],
  [R.T, R.always('release')]
]);

const serialize = R.curry((time, versions, version) => ({
  _id: version,
  version,
  date: new Date(time[version]).getTime(),
  tarball: '', //versions[version].dist.tarball,
  type: typeByTag(version)
}));

const load = async name => {
  return new Promise((resolve, reject) => {
    npm.load(npmConf, () => {
      const callback = (success, ups) => (err, res) => {
        if (err) {
          ups(err);
        } else {
          const f = R.keys(res)[0];
          success(res[f]);
        }
      };
      npm.commands.view([name], true, callback(resolve, reject));
    });
  });
};

const tags = async (load, { packageName }) => {
  const { versions, time, ...data } = await load(packageName);

  // versions  => ['1.0.0', '1.0.1', '1.1.0', ...]
  // time 		 => {'1.0.0': '2018-05-18T09:01:38.604Z', '1.0.1': ... }
  // dist-tags => { latest: '2.2.0' }

  const parse = R.compose(
    R.map(serialize(time, versions)),
    R.reject(releaseIsAlpha),
    R.values
  );

  return parse(data['dist-tags']);
};

const find = async (load, { packageName }) => {
  const { versions, time } = await load(packageName);
  // time is: {'1.0.1': '2018-05-18T11:17:35.529Z'}

  const parse = R.compose(
    R.sortWith([R.descend(R.prop('date'))]),
    R.map(serialize(time, versions)),
    R.reject(notVersionNum),
    R.keys
  );

  return parse(time);
};

export {
  tags,
  find,
  serialize,
  releaseIsAlpha,
  notVersionNum,
  typeByTag,
  load
};
