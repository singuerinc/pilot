import dotenv from "dotenv";
dotenv.config();

export default {
  COMMITS_URL: process.env.COMMITS_URL,
  BRANCHES_URL: process.env.BRANCHES_URL,
  NPM_REGISTRY: process.env.NPM_REGISTRY,
  PASSWORD: process.env.PASSWORD,
  USERNAME: process.env.USERNAME
};
