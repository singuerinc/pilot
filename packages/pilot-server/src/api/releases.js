import npm from 'npm';
import * as R from 'ramda';

const npmConf = {
  registry: 'https://registry.npmjs.org/'
};

const typeIsAlpha = x => x.type === 'alpha';
const isCreatedOrModified = x => x === 'created' || x === 'modified';

const findTagType = R.cond([
  [R.test(/-alpha\./), R.always('alpha')],
  [R.test(/-beta\./), R.always('beta')],
  [R.T, R.always('release')]
]);

const serialize = R.curry((_, timestamps, tag) => ({
  _id: tag,
  version: tag,
  date: new Date(timestamps[tag]).getTime(),
  tarball: '', //versions[tag].dist.tarball,
  type: findTagType(tag._id)
}));

const load = async name => {
  return new Promise((resolve, reject) => {
    npm.load(npmConf, () => {
      // @ts-ignore
      npm.commands.view([name], true, (err, res) => {
        if (err) {
          reject(err);
        } else {
          const f = R.keys(res)[0];

          // {
          //   versions  : ['1.0.0', '1.0.1', '1.1.0', ...],
          //   time 		 : {'1.0.0': '2018-05-18T09:01:38.604Z', '1.0.1': ... },
          //   dist-tags : { latest: '2.2.0' }
          // }

          resolve(res[f]);
        }
      });
    });
  });
};

const tags = async (load, { packageName }) => {
  const { versions, time, ...data } = await load(packageName);

  return R.compose(
    // @ts-ignore
    R.map(serialize(versions, time)),
    R.reject(typeIsAlpha),
    R.values
  )(data['dist-tags']);
};

const find = async (load, { packageName }) => {
  const { versions, time } = await load(packageName);

  return R.compose(
    R.sortWith([R.descend(R.prop('date'))]),
    // @ts-ignore
    R.map(serialize(versions, time)),
    R.reject(isCreatedOrModified),
    R.keys
  )(time);
};

export {
  tags,
  find,
  serialize,
  typeIsAlpha,
  isCreatedOrModified,
  findTagType,
  load
};
