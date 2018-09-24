import R from "ramda";

export const paramsToQuery = R.compose(
  R.join(""),
  R.ifElse(R.length, R.prepend("?"), R.always([])),
  R.join("&"),
  R.map(R.join("=")),
  R.toPairs
);

export const headers = R.compose(
  R.assocPath(["headers", "common", "Authorization"], R.__, {}),
  R.concat("Basic ")
);
