import * as Branches from "./api/branches";
import * as Commits from "./api/commits";
import * as Releases from "./api/releases";
import { headers, commitsUrl, branchesUrl } from "./utils";

export const resolvers = (npm, get) => ({
  Query: {
    async allBranches(_, { project, repo }, { credentials }) {
      return Branches.find({
        loadService: get,
        url: branchesUrl(project, repo),
        headers: headers(credentials)
      });
    },

    async allCommits(_, { project, repo }, { credentials }) {
      return Commits.find({
        loadService: get,
        url: commitsUrl(project, repo, { limit: 50 }),
        headers: headers(credentials)
      });
    },

    async allReleases(_, { packageName }) {
      try {
        const { versions, time } = await Releases.load(npm, packageName);
        return Releases.parseAllReleases(
          Releases.isCreatedOrModified,
          versions,
          time
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
          data["dist-tags"]
        );
      } catch (e) {
        // TODO: figure out what we want return in case the we have an error
        return Promise.reject([]);
      }
    }
  }
});
