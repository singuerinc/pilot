import R from 'ramda';

export const paramsToQuery = R.compose(
  R.join(''),
  R.ifElse(R.length, R.prepend('?'), R.always([])),
  R.join('&'),
  R.map(R.join('=')),
  R.toPairs
);

export const headers = credentials => ({
  headers: { common: { Authorization: `Basic ${credentials}` } }
});
