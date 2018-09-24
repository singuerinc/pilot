import {
  load,
  typeIsAlpha,
  isCreatedOrModified,
  parseReleaseTags,
  parseAllReleases,
  serialize
} from "../releases";

describe("releases", () => {
  describe("isAlpha", () => {
    it("should return true when is an alpha release", () => {
      const x = {
        type: "alpha"
      };
      expect(typeIsAlpha(x)).toBe(true);
    });

    it("should return false when is not an alpha release", () => {
      const x = {
        type: "beta"
      };

      expect(typeIsAlpha(x)).toBe(false);
    });
  });

  describe("notVersionNum", () => {
    it("should return true when is not a release", () => {
      expect(isCreatedOrModified("created")).toBe(true);
    });

    it("should return true when is not a release", () => {
      expect(isCreatedOrModified("modified")).toBe(true);
    });

    it("should return false when is a release", () => {
      expect(isCreatedOrModified("1.0.0")).toBe(false);
    });
  });

  describe("serialize", () => {
    it("should serialize a release", () => {
      expect(
        serialize(
          ["1.0.0", "1.0.1", "1.1.0"],
          { "1.0.1": "2018-05-18T11:17:35.529Z" },
          "1.0.1"
        )
      ).toStrictEqual({
        _id: "1.0.1",
        version: "1.0.1",
        date: 1526642255529,
        tarball: "",
        type: "release"
      });
    });
  });

  describe("load", async () => {
    it("should load all releases", async () => {
      const npmStubGood = {
        load: (_1, callback) => callback(),
        commands: {
          view: (_2, _3, callback) =>
            callback(undefined, {
              "0.0.1": {
                "dist-tags": {},
                time: {},
                versions: {}
              }
            })
        }
      };

      const res = await load(npmStubGood, "foo");

      expect(res).toStrictEqual({
        versions: {},
        time: {},
        "dist-tags": {}
      });
    });

    it("should fail to load releases", async () => {
      const npmStubBad = {
        load: (_1, callback) => callback(),
        commands: {
          view: (_2, _3, callback) => callback(new Error("error!"))
        }
      };

      try {
        await load(npmStubBad, "foo");
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe("error!");
      }
    });
  });

  describe("parseReleaseTags", () => {
    it("should parse the release tags", () => {
      const versions = ["1.0.0", "1.0.1", "1.1.0"];
      const timestamps = {
        created: "2018-05-18T09:01:38.604Z",
        "1.0.0": "2018-05-18T09:01:38.604Z",
        modified: "2018-05-18T09:01:38.604Z"
      };
      const distTags = {
        latest: "1.0.0"
      };

      const res = parseReleaseTags(typeIsAlpha, versions, timestamps)(distTags);
      expect(res).toStrictEqual([
        {
          _id: "1.0.0",
          version: "1.0.0",
          date: 1526634098604,
          tarball: "",
          type: "release"
        }
      ]);
    });
  });

  describe("parseAllReleases", () => {
    it("should parse the release tags", () => {
      const versions = ["1.0.0", "1.0.1", "1.1.0"];
      const timestamps = {
        created: "2018-05-18T09:01:38.604Z",
        "1.0.0": "2018-05-18T09:01:39.604Z",
        "1.0.1": "2018-05-18T09:01:40.604Z",
        "1.1.0": "2018-05-18T09:01:41.604Z",
        modified: "2018-05-18T09:01:42.604Z"
      };
      const parse = parseAllReleases(isCreatedOrModified, versions, timestamps);

      expect(parse(timestamps)).toStrictEqual([
        {
          _id: "1.1.0",
          version: "1.1.0",
          date: 1526634101604,
          tarball: "",
          type: "release"
        },
        {
          _id: "1.0.1",
          version: "1.0.1",
          date: 1526634100604,
          tarball: "",
          type: "release"
        },
        {
          _id: "1.0.0",
          version: "1.0.0",
          date: 1526634099604,
          tarball: "",
          type: "release"
        }
      ]);
    });
  });
});
