import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `
  type Branch {
    _id: ID
  }

  type Commit {
    _id: ID
    date: String
  }

  type Release {
    _id: ID
    date: String
    type: String
    version: String
    tarball: String
  }

  type Query {
    allBranches: [Branch]
    allCommits: [Commit]
    allReleases(packageName: String!): [Release]
    allReleaseTags(packageName: String!): [Release]
  }
`;

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
