import {
  getId,
  findAlpha,
  findBeta,
  findLatest,
  toISOString,
  serializeRelease,
  serializeTags,
  serializeBranch,
  artifacts,
  tags,
  branches,
  fetch
} from "../v1Adapter";
import { buildCredentials } from "../../../utils";

describe("v1Adapter", () => {
  describe("getId", () => {
    it("should return the value of the _id property", () => {
      expect(getId({ _id: 1 })).toBe(1);
    });
  });

  describe("findAlpha, findBeta, findRelease, serializeTags", () => {
    const tags = [
      {
        _id: "0.0.1-alpha.0001",
        type: "alpha"
      },
      {
        _id: "0.0.1-beta.0001",
        type: "beta"
      },
      {
        _id: "0.0.1",
        type: "latest"
      }
    ];

    describe("findAlpha", () => {
      it("should return the object with the alpha type", () => {
        expect(findAlpha(tags)).toStrictEqual({
          _id: "0.0.1-alpha.0001",
          type: "alpha"
        });
      });
    });

    describe("findBeta", () => {
      it("should return the object with the beta type", () => {
        expect(findBeta(tags)).toStrictEqual({
          _id: "0.0.1-beta.0001",
          type: "beta"
        });
      });
    });

    describe("findRelease", () => {
      it("should return the object with the latest type", () => {
        expect(findLatest(tags)).toStrictEqual({
          _id: "0.0.1",
          type: "latest"
        });
      });
    });

    describe("serializeTags", () => {
      it("should serialize raw tags into proper objects", () => {
        expect(serializeTags(tags)).toStrictEqual({
          alpha: "0.0.1-alpha.0001",
          beta: "0.0.1-beta.0001",
          latest: "0.0.1"
        });
      });
    });
  });

  describe("serializeRelease", () => {
    it("should serialize raw release into proper object", () => {
      expect(
        serializeRelease({
          version: "0.0.1",
          date: "2018-10-01T11:47:44.344Z",
          tarball: "http://foo.bar/release.zip"
        })
      ).toStrictEqual({
        version: "0.0.1",
        time: "2018-10-01T11:47:44.344Z",
        tarball: "http://foo.bar/release.zip"
      });
    });
  });

  describe("serializeBranch", () => {
    it("should serialize raw branch into proper object", () => {
      expect(
        serializeBranch({
          _id: "master"
        })
      ).toStrictEqual({
        displayId: "master",
        package: "",
        artifact: {
          tarball: "",
          time: "",
          version: ""
        }
      });
    });
  });

  describe("artifacts", () => {
    it("should load the artifacts", () => {
      const allArtifacts = [
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
      ];

      const apiStubGood = {
        allReleases: () => Promise.resolve(allArtifacts)
      };

      // @ts-ignore
      expect(artifacts(apiStubGood, "foo")).resolves.toStrictEqual([
        {
          tarball: "",
          time: "2018-05-18T09:01:41.604Z",
          version: "1.1.0"
        },
        {
          tarball: "",
          time: "2018-05-18T09:01:40.604Z",
          version: "1.0.1"
        },
        {
          tarball: "",
          time: "2018-05-18T09:01:39.604Z",
          version: "1.0.0"
        }
      ]);
    });
  });

  describe("tags", () => {
    it("should load the tags", () => {
      const allTags = [
        {
          _id: "1.0.0",
          version: "1.0.0",
          date: 1526634098604,
          tarball: "",
          type: "release"
        },
        {
          _id: "1.0.0-beta.0001",
          version: "1.0.0-beta.0001",
          date: 1526634098604,
          tarball: "",
          type: "beta"
        }
      ];

      const apiStubGood = {
        allReleaseTags: () => Promise.resolve(allTags)
      };

      // @ts-ignore
      expect(tags(apiStubGood, "foo")).resolves.toStrictEqual([
        {
          _id: "1.0.0",
          version: "1.0.0",
          date: 1526634098604,
          tarball: "",
          type: "release"
        },
        {
          _id: "1.0.0-beta.0001",
          version: "1.0.0-beta.0001",
          date: 1526634098604,
          tarball: "",
          type: "beta"
        }
      ]);
    });
  });

  describe("branches", () => {
    it("should load the branches", () => {
      const allBranches = [
        { _id: "master" },
        { _id: "feature/feature-1" },
        { _id: "bugfix/bugfix-1" },
        { _id: "experiment/experiment-1" }
      ];

      const apiStubGood = {
        allBranches: () => Promise.resolve(allBranches)
      };

      expect(
        // @ts-ignore
        branches(apiStubGood, "project", "repo", {})
      ).resolves.toStrictEqual([
        {
          displayId: "master",
          package: "",
          artifact: {
            time: "",
            version: "",
            tarball: ""
          }
        },
        {
          displayId: "feature/feature-1",
          package: "",
          artifact: {
            time: "",
            version: "",
            tarball: ""
          }
        },
        {
          displayId: "bugfix/bugfix-1",
          package: "",
          artifact: {
            time: "",
            version: "",
            tarball: ""
          }
        },
        {
          displayId: "experiment/experiment-1",
          package: "",
          artifact: {
            time: "",
            version: "",
            tarball: ""
          }
        }
      ]);
    });
  });

  describe("fetch", () => {
    it.skip("should fetch all the data", () => {
      const npmStubGood = {};
      const axiosStubGood = {};
      const artifactsStub = () =>
        Promise.resolve([
          {
            tarball: "",
            time: "2018-05-18T09:01:41.604Z",
            version: "1.1.0"
          }
        ]);
      const tagsStub = () =>
        Promise.resolve([
          {
            _id: "1.0.0",
            version: "1.0.0",
            date: 1526634098604,
            tarball: "",
            type: "release"
          },
          {
            _id: "1.0.0-beta.0001",
            version: "1.0.0-beta.0001",
            date: 1526634098604,
            tarball: "",
            type: "beta"
          },
          {
            _id: "1.0.0-alpha.0001",
            version: "1.0.0-alpha.0001",
            date: 1526634098604,
            tarball: "",
            type: "alpha"
          }
        ]);
      const branchesStub = () => Promise.resolve([{ _id: "master" }]);

      expect(
        fetch(
          npmStubGood,
          // @ts-ignore
          axiosStubGood,
          artifactsStub,
          tagsStub,
          branchesStub,
          buildCredentials,
          serializeTags,
          "foo",
          "bar",
          "baz"
        )
      ).resolves.toStrictEqual({
        artifacts: {
          tags: {
            alpha: "1.0.0-alpha.0001",
            beta: "1.0.0-beta.0001",
            latest: "1.0.0"
          },
          versions: [
            {
              tarball: "",
              time: "2018-05-18T09:01:41.604Z",
              version: "1.1.0"
            }
          ]
        },
        branches: [
          {
            _id: "master"
          }
        ],
        project: {
          domain: "http://domain/",
          packageName: "foo",
          project: "bar",
          repo: "baz"
        },
        pullRequests: {
          values: [
            {
              id: "",
              fromRef: {
                displayId: ""
              },
              author: {
                user: {
                  slug: ""
                }
              },
              links: {
                self: [
                  {
                    href: ""
                  }
                ]
              }
            }
          ]
        },
        tags: {
          alpha: {
            version: "1.0.0-alpha.0001",
            time: "2018-05-18T09:01:38.604Z",
            tarball: ""
          },
          beta: {
            version: "1.0.0-beta.0001",
            time: "2018-05-18T09:01:38.604Z",
            tarball: ""
          },
          latest: {
            version: "1.0.0",
            time: "2018-05-18T09:01:38.604Z",
            tarball: ""
          }
        }
      });
    });

    it("should fail to fetch", async () => {
      const npmStubGood = {};
      const axiosStubGood = {};
      const artifactsStub = () => Promise.reject();
      const tagsStub = () => Promise.reject();
      const branchesStub = () => Promise.reject();

      const { error } = await fetch(
        npmStubGood,
        // @ts-ignore
        axiosStubGood,
        artifactsStub,
        tagsStub,
        branchesStub,
        buildCredentials,
        serializeTags,
        "foo",
        "bar",
        "baz"
      );

      expect(error).toBe(1);
    });
  });
});
