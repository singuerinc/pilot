import { find, serialize, ILoadService } from "../commits";
import { IHeaders } from "../../utils";

describe("commits", () => {
  describe("serialize", () => {
    it("should serialize a commit", () => {
      const input = {
        id: "123",
        authorTimestamp: "4321"
      };
      const x = serialize(input);

      expect(x).toStrictEqual({
        _id: "123",
        date: "4321"
      });
    });

    it("should return null date if the authorTimestamp is not present", () => {
      const input = {
        id: "123"
      };
      const x = serialize(input);

      expect(x).toStrictEqual({
        _id: "123",
        date: null
      });
    });
  });

  describe("find", async () => {
    it("should return all the commits", async () => {
      const response = {
        values: [
          {
            id: "6bbe9aab7f181b919c884c25c468e7335bed47f5",
            authorTimestamp: "149261208"
          },
          {
            id: "c10483a950c77565f8a4b7e533cb38fffc5b15d4",
            authorTimestamp: "149260311"
          }
        ]
      };

      const axiosGetStubGood = () => Promise.resolve({ data: response });

      const url = "https://foo.bar";
      const headers = {};

      const expected = [
        {
          _id: "6bbe9aab7f181b919c884c25c468e7335bed47f5",
          date: "149261208"
        },
        {
          _id: "c10483a950c77565f8a4b7e533cb38fffc5b15d4",
          date: "149260311"
        }
      ];

      expect(find(axiosGetStubGood, url, headers)).resolves.toStrictEqual(
        expected
      );
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
