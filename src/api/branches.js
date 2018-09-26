import map from "ramda/src/map";

export const serialize = (x) => ({
  _id: x.displayId
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    return map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
