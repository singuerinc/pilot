import axios from 'axios';
import npm from 'npm';
import Branches from './api/branches';
import * as Commits from './api/commits';
import * as Releases from './api/releases';
import { headers } from './utils';

export const resolvers = {
  Query: {
    async allBranches(_, { project, repo }, { credentials }) {
      return Branches.find({
        loadService: axios.get,
        url: Branches.url(project, repo),
        headers: headers(credentials)
      });
    },

    async allCommits(_, { project, repo }, { credentials }) {
      return Commits.find({
        loadService: axios.get,
        url: Commits.url(project, repo, { limit: 50 }),
        headers: headers(credentials)
      });
    },

    async allReleases(_, { packageName }) {
      try {
        const { versions, time } = await Releases.load(npm, packageName);
        return Releases.parseAllReleases(
          Releases.isCreatedOrModified,
          versions
        )(time);
      } catch (e) {
        // TODO: figure out what we want return in case the we have an error
        return Promise.reject([]);
      }
    },

    async allReleaseTags(_, { packageName }) {
      try {
        const { versions, time, ...data } = await Releases.load(
          npm,
          packageName
        );
        return Releases.parseReleaseTags(Releases.typeIsAlpha, versions, time)(
          data['dist-tags']
        );
      } catch (e) {
        // TODO: figure out what we want return in case the we have an error
        return Promise.reject([]);
      }
    }
  }
};
