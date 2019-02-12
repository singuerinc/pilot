import * as R from "ramda";

export interface IBranch {
  _id: string;
}

export const serialize = R.applySpec<IBranch>({
  _id: R.prop("displayId")
});

export const find = async (loadService, url: string, headers: string) => {
  try {
    const { data } = await loadService(url, headers);
    const serialized = R.map(serialize, data.values);
    return serialized;
  } catch (err) {
    return err;
  }
};
