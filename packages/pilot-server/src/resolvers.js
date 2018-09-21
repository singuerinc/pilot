import Branches from './api/branches';
import Commits from './api/commits';
import * as Releases from './api/releases';

export const resolvers = {
  Query: {
    async allBranches(_, { project, repo }, { credentials }) {
      return await Branches.find({ project, repo, credentials });
    },
    async allCommits(_, { project, repo }, { credentials }) {
      return await Commits.find({ project, repo, credentials });
    },
    async allReleases(_, { packageName }) {
      return await Releases.find({ packageName });
    },
    async allReleaseTags(_, { packageName }) {
      return await Releases.tags({ packageName });
    }
  }
};
