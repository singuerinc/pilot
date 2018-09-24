import { find, serialize } from "../branches";

describe("branches", () => {
  describe("serialize", () => {
    it("should serialize a branch", () => {
      const input = {
        displayId: "123"
      };
      const x = serialize(input);

      expect(x).toStrictEqual({
        _id: "123"
      });
    });
  });

  describe("find", async () => {
    it("should return all the branches", async () => {
      const response = {
        size: 1,
        limit: 25,
        isLastPage: true,
        values: [
          {
            id: "refs/heads/master",
            displayId: "master",
            type: "BRANCH",
            latestCommit: "9f5359b292236723920eeadd8272a5c499fab9bd",
            latestChangeset: "9f5359b292236723920eeadd8272a5c499fab9bd",
            isDefault: false
          }
        ],
        start: 0
      };
      const axiosGetStubGood = () => Promise.resolve({ data: response });
      const url = "https://foo.bar";
      const headers = {};
      const res = await find(axiosGetStubGood, url, headers);
      expect(res).toStrictEqual([{ _id: "master" }]);
    });

    it("should return an Error when the request fails", async () => {
      const axiosGetStubBad = () => Promise.reject(new Error("oups!"));
      const url = "https://foo.bar";
      const headers = {};

      try {
        await find(axiosGetStubBad, url, headers);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe("oups!");
      }
    });
  });
});
