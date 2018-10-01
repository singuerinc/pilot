import map from "ramda/src/map";
import applySpec from "ramda/src/applySpec";
import prop from "ramda/src/prop";

export const serialize = applySpec({
  _id: prop("displayId")
});

export const find = async (loadService, url, headers) => {
  try {
    const { data } = await loadService(url, headers);
    const serialized = map(serialize, data.values);
    return serialized;
  } catch (err) {
    return err;
  }
};
