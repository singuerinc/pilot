[![CircleCI](https://circleci.com/gh/singuerinc/pilot/tree/master.svg?style=svg)](https://circleci.com/gh/singuerinc/pilot/tree/master) [![codecov](https://codecov.io/gh/singuerinc/pilot/branch/master/graph/badge.svg)](https://codecov.io/gh/singuerinc/pilot) [![Known Vulnerabilities](https://snyk.io/test/github/singuerinc/pilot/badge.svg)](https://snyk.io/test/github/singuerinc/pilot) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/4edfb51bc7584da8b1787274b1ba70e5)](https://www.codacy.com/app/nahuel.scotti/pilot)

# Pilot

Aggregates information from NPM, Bitbucket among other services and exposes an API to keep an eye on your favourites npm packages.

## API

Currently the are 4 endpoints in the API (Graphql based)

![API](./docs/api.svg)

```gql
type Query {
  allBranches: [Branch]
  allCommits: [Commit]
  allReleases(packageName: String!): [Release]
  allReleaseTags(packageName: String!): [Release]
}
```
