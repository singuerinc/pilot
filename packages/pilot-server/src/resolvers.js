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
      const { versions, time } = await Releases.load(packageName);
      return Releases.parseAllReleases(Releases.isCreatedOrModified, versions)(
        time
      );
    },

    async allReleaseTags(_, { packageName }) {
      const { versions, time, ...data } = await Releases.load(packageName);
      return Releases.parseReleaseTags(Releases.typeIsAlpha, versions, time)(
        data['dist-tags']
      );
    }
  }
};
