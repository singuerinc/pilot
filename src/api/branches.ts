import * as R from "ramda";
import { IHeaders } from "../utils";
import { ILoadService } from "./commits";

export interface IBranch {
  _id: string;
}

export const serialize = R.applySpec<IBranch>({
  _id: R.prop("displayId")
});

export async function find(
  loadService: ILoadService,
  url: string,
  headers: IHeaders
): Promise<IBranch[]> {
  try {
    const { data } = await loadService(url, headers);
    const serialized = R.map(serialize, data.values);
    return serialized;
  } catch (err) {
    return err;
  }
}
