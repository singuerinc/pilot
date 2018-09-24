import {
  paramsToQuery,
  headers,
  buildCredentials,
  branchesUrl,
  commitsUrl
} from "../utils";

describe("utils", () => {
  describe("paramsToQuery", () => {
    it("should return a query string", () => {
      const res = paramsToQuery({
        age: 50,
        gender: "female"
      });

      expect(res).toBe("?age=50&gender=female");
    });

    it("should return an empty query string when an empty object is passed", () => {
      const res = paramsToQuery({});
      expect(res).toBe("");
    });
  });

  describe("headers", () => {
    it("should return a headers object", () => {
      const credentials = "base64string";
      const expected = {
        headers: {
          common: {
            Authorization: "Basic base64string"
          }
        }
      };

      expect(headers(credentials)).toStrictEqual(expected);
    });
  });

  describe("buildCredentials", () => {
    it("should return the base64 string", () => {
      const res = buildCredentials("foo", "bar");
      expect(res).toBe("Zm9vOmJhcg==");
    });
  });

  describe("branchesUrl", () => {
    it("should return a contructed url", () => {
      const input = branchesUrl("MY_PROJECT", "MY_REPO");
      const expected =
        "https://bitbucket.com/rest/api/1.0/projects/MY_PROJECT/repos/MY_REPO/branches";

      expect(input).toBe(expected);
    });
  });

  describe("commitsUrl", () => {
    it("should return a contructed url", () => {
      const input = commitsUrl("MY_PROJECT", "MY_REPO", { limit: 100 });
      const expected =
        "https://bitbucket.com/rest/api/1.0/projects/MY_PROJECT/repos/MY_REPO/commits?limit=100";

      expect(input).toBe(expected);
    });
  });
});
