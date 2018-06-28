import axios from 'axios';
import { map } from 'ramda';
import { headers } from '../utils';

export const allUrl = (project, repo) => {
  return `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/branches`;
};

export default {
  async find({ project, repo, credentials }) {
    const { data } = await axios.get(
      allUrl(project, repo),
      headers(credentials)
    );

    const asBranch = x => ({
      _id: x.id
    });

    return map(asBranch, data.values);
  }
};
