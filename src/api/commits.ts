import * as R from "ramda";
import { IHeaders } from "../utils";

export interface ICommit {
  _id: string;
  date: string;
}

// TODO: be sure that we can return null for date
export const serialize = R.applySpec<ICommit>({
  _id: R.prop("id"),
  date: R.propOr(null, "authorTimestamp")
});

export const find = async (
  loadService,
  url: string,
  headers: IHeaders
): Promise<ICommit[]> => {
  try {
    const { data } = await loadService(url, headers);
    return R.map(serialize, data.values);
  } catch (err) {
    return err;
  }
};
