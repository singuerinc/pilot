import map from "ramda/src/map";
import propOr from "ramda/src/propOr";
import applySpec from "ramda/src/applySpec";
import prop from "ramda/src/prop";

// TODO: be sure that we can return null for date
export const serialize = applySpec({
  _id: prop("id"),
  date: propOr(null, "authorTimestamp")
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
