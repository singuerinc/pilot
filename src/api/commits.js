import * as R from "ramda";

// TODO: be sure that we can return null for date
export const serialize = R.applySpec({
  _id: R.prop("id"),
  date: R.propOr(null, "authorTimestamp")
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return R.map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
