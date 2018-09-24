[![CircleCI](https://circleci.com/gh/singuerinc/pilot/tree/master.svg?style=svg)](https://circleci.com/gh/singuerinc/pilot/tree/master) [![codecov](https://codecov.io/gh/singuerinc/pilot/branch/master/graph/badge.svg)](https://codecov.io/gh/singuerinc/pilot) [![Known Vulnerabilities](https://snyk.io/test/github/singuerinc/pilot/badge.svg)](https://snyk.io/test/github/singuerinc/pilot) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/4edfb51bc7584da8b1787274b1ba70e5)](https://www.codacy.com/app/nahuel.scotti/pilot)

# Pilot

Aggregates information from NPM, Bitbucket among other services and exposes an API to keep an eye on your favourites npm packages.

## API

<div style="display: flex; justify-items: center;">
  <img width="50%" src="./docs/api.svg" style="margin: 0 auto;" />
</div>

| REST                                  | Graphql                                           |
| ------------------------------------- | ------------------------------------------------- |
| `/api/v2/branches?project=x1&repo=x2` | `allBranches: [Branch]`                           |
| `/api/v2/commits?project=x1&repo=x2`  | `allCommits: [Commit]`                            |
| `/api/v2/releases/all?package=pkg1`   | `allReleases(packageName: String!): [Release]`    |
| `/api/v2/releases/tags?package=pkg1`  | `allReleaseTags(packageName: String!): [Release]` |
