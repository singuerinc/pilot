import axios from 'axios';
import { map } from 'ramda';
import { headers } from '../utils';

export const url = (project, repo, limit) => {
  return `https://bitbucket.com/rest/api/1.0/projects/${project}/repos/${repo}/commits?limit=${limit}`;
};

export default {
  async find({ project, repo, credentials }) {
    const { data } = await axios.get(
      url(project, repo, 50),
      headers(credentials)
    );

    const asCommit = x => ({
      _id: x.id,
      date: `${x.authorTimestamp}`
    });

    return map(asCommit, data.values);
  }
};
