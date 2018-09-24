import { paramsToQuery, headers } from "../utils";

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
});
