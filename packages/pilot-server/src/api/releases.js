import npm from 'npm';
import { descend, keys, map, prop, reject, sortWith, values } from 'ramda';

export const sortByDate = sortWith([descend(prop('date'))]);

export const type = x => {
  if (/-alpha\./.test(x)) {
    return 'alpha';
  } else if (/-beta\./.test(x)) {
    return 'beta';
  } else {
    return 'latest';
  }
};

export const asRelease = time => vers => x => {
  return {
    _id: x,
    version: x,
    date: new Date(time[x]).getTime(),
    tarball: '', //vers[x].dist.tarball,
    type: type(x)
  };
};

const load = async name => {
  return new Promise((resolve, reject) => {
    npm.load({ registry: 'https://registry.npmjs.org/' }, () => {
      npm.commands.view([name], true, (err, res) => {
        if (err) {
          reject(err);
        } else {
          const f = keys(res)[0];
          resolve(res[f]);
        }
      });
    });
  });
};

export default {
  async tags({ packageName }) {
    const data = await load(packageName);
    const { versions, time } = data;

    const isAlpha = x => x.type === 'alpha';

    const all = sortByDate(
      map(asRelease(time)(versions), values(data['dist-tags']))
    );

    return reject(isAlpha, all);
  },

  async find({ packageName }) {
    const data = await load(packageName);
    const { versions, time } = data;

    const isNotRelease = x => x === 'created' || x === 'modified';
    const artifacts = reject(isNotRelease, keys(time));

    const allSorted = sortByDate(map(asRelease(time)(versions), artifacts));

    return allSorted;
  }
};
