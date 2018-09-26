import map from "ramda/src/map";
import propOr from "ramda/src/propOr";

// TODO: be sure that we can return null for date
export const serialize = (x) => ({
  _id: x.id,
  date: propOr(null, "authorTimestamp", x)
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
