import * as Branches from "./api/branches";
import * as Commits from "./api/commits";
import * as Releases from "./api/releases";
import { branchesUrl, commitsUrl, headers } from "./utils";

interface IWithProjectAndRepo {
  project: string;
  repo: string;
}

interface IWithCredentials {
  credentials: string;
}

interface IWithPackageName {
  packageName: string;
}

export const resolvers = (npm, axios) => ({
  Query: {
    async allBranches(
      _,
      { project, repo }: IWithProjectAndRepo,
      { credentials }: IWithCredentials
    ) {
      return Branches.find(
        axios.get,
        branchesUrl(project, repo),
        headers(credentials)
      );
    },

    async allCommits(
      _,
      { project, repo }: IWithProjectAndRepo,
      { credentials }: IWithCredentials
    ) {
      return Commits.find(
        axios.get,
        commitsUrl(project, repo, { limit: 50 }),
        headers(credentials)
      );
    },

    async allReleases(_, { packageName }: IWithPackageName) {
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

    async allReleaseTags(_, { packageName }: IWithPackageName) {
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
