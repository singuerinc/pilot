import axios from "axios";
import { map } from "ramda";
import { headers } from "../utils";

// FIXME: out!
export const url = (project, repo) =>
  `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/branches`;

export default {
  async find({ loadService, url, headers }) {
    const { data } = await loadService(url, headers);

    const asBranch = (x) => ({
      _id: x.id
    });

    return map(asBranch, data.values);
  }
};
