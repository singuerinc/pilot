import axios from 'axios';
import npm from 'npm';
import Branches from './api/branches';
import * as Commits from './api/commits';
import * as Releases from './api/releases';
import { headers } from './utils';

export const resolvers = {
  Query: {
    async allBranches(_, { project, repo }, { credentials }) {
      return await Branches.find({ project, repo, credentials });
    },

    async allCommits(_, { project, repo }, { credentials }) {
      return await Commits.find({
        loadService: axios.get,
        url: Commits.url(project, repo, { limit: 50 }),
        headers: headers(credentials)
      });
    },

    async allReleases(_, { packageName }) {
      const { versions, time } = await Releases.load(npm, packageName);
      return Releases.parseAllReleases(Releases.isCreatedOrModified, versions)(
        time
      );
    },

    async allReleaseTags(_, { packageName }) {
      const { versions, time, ...data } = await Releases.load(npm, packageName);
      return Releases.parseReleaseTags(Releases.typeIsAlpha, versions, time)(
        data['dist-tags']
      );
    }
  }
};
