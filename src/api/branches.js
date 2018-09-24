import axios from "axios";
import { map } from "ramda";
import { headers } from "../utils";

// FIXME: out!
export const url = (project, repo) =>
  `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/branches`;

export const serialize = (x) => ({
  _id: x.displayId
});

export const find = async (loadService, url, headers) => {
  const { data } = await loadService(url, headers);
  return map(serialize, data.values);
};
