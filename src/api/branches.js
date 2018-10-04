import * as R from "ramda";

export const serialize = R.applySpec({
  _id: R.prop("displayId")
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    const serialized = R.map(serialize, data.values);
    return serialized;
  } catch (err) {
    return err;
  }
};
