import R from "ramda";

export const serialize = (x) => ({
  _id: x.displayId
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return R.map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
