import { resolvers, API } from "../resolvers";
jest.mock("../config");

const npmStubGood = {
  load: (_1: any, callback: any) => callback(),
  commands: {
    view: (_2: any, _3: any, callback: any) =>
      callback(null, {
        "0.0.1": {
          "dist-tags": {},
          time: {},
          versions: {}
        }
      })
  }
};

const axiosGetGood = {
  get: () =>
    Promise.resolve({
      data: {
        values: [
          {
            id: "refs/heads/master",
            displayId: "master",
            type: "BRANCH",
            latestCommit: "9f5359b292236723920eeadd8272a5c499fab9bd",
            latestChangeset: "9f5359b292236723920eeadd8272a5c499fab9bd",
            isDefault: false
          }
        ]
      }
    })
};

describe("resolvers", () => {
  describe("allBranches", () => {
    let rlvs: { Query: API };
    beforeEach(() => {
      rlvs = resolvers(npmStubGood, axiosGetGood);
    });

    it("should work", async () => {
      //@ts-ignore
      const res = await rlvs.Query.allBranches(
        null,
        { project: "MY_PROJECT", repo: "MY_REPO" },
        { credentials: "" }
      );
      expect(res).toStrictEqual([
        {
          _id: "master"
        }
      ]);
    });
  });
});
