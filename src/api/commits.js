import R from "ramda";
import { paramsToQuery } from "../utils";

// FIXME: hard coded urls are always bad, get from config
const url = (project, repo, { limit }) =>
  `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/commits${paramsToQuery(
    { limit }
  )}`;

// TODO: be sure that we can return null for date
const serialize = (x) => ({
  _id: x.id,
  date: R.propOr(null, "authorTimestamp", x)
});

// TODO: refactor, more FP way
const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return R.map(serialize, data.values);
  } catch (err) {
    return err;
  }
};

export { url, serialize, find };
