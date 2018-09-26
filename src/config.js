import dotenv from "dotenv";
dotenv.config();

export default {
  BITBUCKET_COMMITS_URL: process.env.BITBUCKET_COMMITS_URL,
  BITBUCKET_BRANCHES_URL: process.env.BITBUCKET_BRANCHES_URL,
  PASSWORD: process.env.PASSWORD,
  USERNAME: process.env.USERNAME
};
