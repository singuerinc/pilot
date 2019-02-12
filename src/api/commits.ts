import * as R from "ramda";
import { IHeaders } from "../utils";

type ILoadService = (
  url: string,
  headers: IHeaders
) => Promise<{ data: { values: IRawCommit[] } }>;

export interface ICommit {
  _id: string;
  date: string;
}

interface IRawCommit {
  id: string;
  authorTimestamp: string;
}

// TODO: be sure that we can return null for date
export function serialize(x: IRawCommit) {
  return R.applySpec<ICommit>({
    _id: R.prop("id"),
    date: R.propOr(null, "authorTimestamp")
  })(x);
}

export const find = async (
  loadService: ILoadService,
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
