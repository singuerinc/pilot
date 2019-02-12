var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
define("config", ["require", "exports", "dotenv"], function (require, exports, dotenv) {
    "use strict";
    exports.__esModule = true;
    dotenv.config();
    exports["default"] = {
        COMMITS_URL: process.env.COMMITS_URL,
        BRANCHES_URL: process.env.BRANCHES_URL,
        NPM_REGISTRY: process.env.NPM_REGISTRY,
        PASSWORD: process.env.PASSWORD,
        USERNAME: process.env.USERNAME
    };
});
define("utils", ["require", "exports", "ramda", "config"], function (require, exports, R, config_1) {
    "use strict";
    exports.__esModule = true;
    exports.paramsToQuery = R.compose(R.join(""), R.ifElse(R.equals(1), R.prepend("?"), R.always([])), R.join("&"), R.map(R.join("=")), R.toPairs);
    function headers(x) {
        return R.compose(R.assocPath(["headers", "common", "Authorization"], R.__, {}), R.concat("Basic "))(x);
    }
    exports.headers = headers;
    function buildCredentials(username, password) {
        return Buffer.from(username + ":" + password, "ascii").toString("base64");
    }
    exports.buildCredentials = buildCredentials;
    exports.branchesUrl = function (project, repo) {
        return R.compose(R.replace("%project%", project), R.replace("%repo%", repo))(config_1["default"].BRANCHES_URL);
    };
    exports.commitsUrl = function (project, repo, _a) {
        var limit = _a.limit;
        return R.compose(R.flip(R.concat)(exports.paramsToQuery({ limit: limit })), R.replace("%project%", project), R.replace("%repo%", repo))(config_1["default"].COMMITS_URL);
    };
});
define("api/branches", ["require", "exports", "ramda"], function (require, exports, R) {
    "use strict";
    exports.__esModule = true;
    exports.serialize = R.applySpec({
        _id: R.prop("displayId")
    });
    function find(loadService, url, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var data, serialized, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, loadService(url, headers)];
                    case 1:
                        data = (_a.sent()).data;
                        serialized = R.map(exports.serialize, data.values);
                        return [2, serialized];
                    case 2:
                        err_1 = _a.sent();
                        return [2, err_1];
                    case 3: return [2];
                }
            });
        });
    }
    exports.find = find;
});
define("api/commits", ["require", "exports", "ramda"], function (require, exports, R) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    function serialize(x) {
        return R.applySpec({
            _id: R.prop("id"),
            date: R.propOr(null, "authorTimestamp")
        })(x);
    }
    exports.serialize = serialize;
    exports.find = function (loadService, url, headers) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, loadService(url, headers)];
                case 1:
                    data = (_a.sent()).data;
                    return [2, R.map(serialize, data.values)];
                case 2:
                    err_2 = _a.sent();
                    return [2, err_2];
                case 3: return [2];
            }
        });
    }); };
});
define("api/releases", ["require", "exports", "ramda", "config"], function (require, exports, R, config_2) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    exports.npmConf = function () { return ({
        registry: config_2["default"].NPM_REGISTRY
    }); };
    function typeIsAlpha(release) {
        return R.compose(R.equals("alpha"), R.prop("type"))(release);
    }
    exports.typeIsAlpha = typeIsAlpha;
    function typeIsBeta(release) {
        return R.compose(R.equals("beta"), R.prop("type"))(release);
    }
    exports.typeIsBeta = typeIsBeta;
    exports.typeIsRelease = function (x) { return !typeIsAlpha(x) && !typeIsBeta(x); };
    exports.isCreatedOrModified = function (x) {
        return x === "created" || x === "modified";
    };
    exports.findTagType = R.cond([
        [R.test(/-alpha\./), R.always("alpha")],
        [R.test(/-beta\./), R.always("beta")],
        [R.T, R.always("release")]
    ]);
    exports.serialize = R.curry(function (versions, timestamps, version) { return ({
        _id: version,
        version: version,
        date: new Date(timestamps[version]).getTime(),
        tarball: "",
        type: exports.findTagType(version)
    }); });
    exports.parseReleaseTags = function (typeIsAlphaFn, versions, timestamps) {
        return R.compose(R.map(exports.serialize(versions, timestamps)), R.reject(typeIsAlphaFn), R.values);
    };
    exports.parseAllReleases = function (isCreatedOrModifiedFn, versions, timestamps) {
        return R.compose(R.sortWith([R.descend(R.prop("date"))]), R.map(exports.serialize(versions, timestamps)), R.reject(isCreatedOrModifiedFn), R.keys);
    };
    exports.load = function (npm, name) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, npm.packument(name)];
                case 1:
                    res = _a.sent();
                    return [2, res];
            }
        });
    }); };
});
define("resolvers", ["require", "exports", "api/branches", "api/commits", "api/releases", "utils"], function (require, exports, Branches, Commits, Releases, utils_1) {
    "use strict";
    exports.__esModule = true;
    function resolvers(npm, axios) {
        return {
            Query: {
                allBranches: function (_, _a, _b) {
                    var project = _a.project, repo = _a.repo;
                    var credentials = _b.credentials;
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_c) {
                            return [2, Branches.find(axios.get, utils_1.branchesUrl(project, repo), utils_1.headers(credentials))];
                        });
                    });
                },
                allCommits: function (_, _a, _b) {
                    var project = _a.project, repo = _a.repo;
                    var credentials = _b.credentials;
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_c) {
                            return [2, Commits.find(axios.get, utils_1.commitsUrl(project, repo, { limit: 50 }), utils_1.headers(credentials))];
                        });
                    });
                },
                allReleases: function (_, _a) {
                    var packageName = _a.packageName;
                    return __awaiter(this, void 0, void 0, function () {
                        var _b, versions, time, e_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    return [4, Releases.load(npm, packageName)];
                                case 1:
                                    _b = _c.sent(), versions = _b.versions, time = _b.time;
                                    return [2, Releases.parseAllReleases(Releases.isCreatedOrModified, versions, time)(time)];
                                case 2:
                                    e_1 = _c.sent();
                                    return [2, Promise.reject([])];
                                case 3: return [2];
                            }
                        });
                    });
                },
                allReleaseTags: function (_, _a) {
                    var packageName = _a.packageName;
                    return __awaiter(this, void 0, void 0, function () {
                        var _b, versions, time, data, e_2;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    return [4, Releases.load(npm, packageName)];
                                case 1:
                                    _b = _c.sent(), versions = _b.versions, time = _b.time, data = __rest(_b, ["versions", "time"]);
                                    return [2, Releases.parseReleaseTags(Releases.typeIsAlpha, versions, time)(data["dist-tags"])];
                                case 2:
                                    e_2 = _c.sent();
                                    return [2, Promise.reject([])];
                                case 3: return [2];
                            }
                        });
                    });
                }
            }
        };
    }
    exports.resolvers = resolvers;
});
define("schema", ["require", "exports", "axios", "libnpm", "graphql-tools", "resolvers"], function (require, exports, axios_1, libnpm_1, graphql_tools_1, resolvers_1) {
    "use strict";
    exports.__esModule = true;
    var typeDefs = "\n  type Branch {\n    _id: ID\n  }\n\n  type Commit {\n    _id: ID\n    date: String\n  }\n\n  type Release {\n    _id: ID\n    date: String\n    type: String\n    version: String\n    tarball: String\n  }\n\n  type Query {\n    allBranches(project: String!, repo: String!): [Branch]\n    allCommits(project: String!, repo: String!): [Commit]\n    allReleases(packageName: String!): [Release]\n    allReleaseTags(packageName: String!): [Release]\n  }\n";
    exports["default"] = graphql_tools_1.makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers_1.resolvers(libnpm_1["default"], axios_1["default"])
    });
});
define("api/legacy-v1/v1Adapter", ["require", "exports", "ramda", "config", "resolvers", "api/releases"], function (require, exports, R, config_3, resolvers_2, releases_1) {
    "use strict";
    exports.__esModule = true;
    exports.getId = R.propOr("", "_id");
    exports.findAlpha = R.find(releases_1.typeIsAlpha);
    exports.findBeta = R.find(releases_1.typeIsBeta);
    exports.findLatest = R.find(releases_1.typeIsRelease);
    exports.findAndGetId = function (predicate) {
        return R.compose(exports.getId, predicate);
    };
    exports.findAndSerialize = function (predicate) {
        return R.compose(exports.serializeRelease, predicate);
    };
    exports.toISOString = function (x) { return new Date(x).toISOString(); };
    exports.serializeRelease = R.applySpec({
        version: R.prop("version"),
        time: R.compose(exports.toISOString, R.prop("date")),
        tarball: R.prop("tarball")
    });
    exports.latestTags = R.applySpec({
        alpha: exports.findAndSerialize(exports.findAlpha),
        beta: exports.findAndSerialize(exports.findBeta),
        latest: exports.findAndSerialize(exports.findLatest)
    });
    exports.serializeTags = R.applySpec({
        alpha: exports.findAndGetId(exports.findAlpha),
        beta: exports.findAndGetId(exports.findBeta),
        latest: exports.findAndGetId(exports.findLatest)
    });
    exports.serializeBranch = R.applySpec({
        displayId: exports.getId,
        package: R.always(""),
        artifact: {
            time: R.always(""),
            version: R.always(""),
            tarball: R.always("")
        }
    });
    exports.artifacts = function (api, packageName) {
        return api.allReleases(null, { packageName: packageName }).then(R.map(exports.serializeRelease));
    };
    exports.tags = function (api, packageName) {
        return api.allReleaseTags(null, { packageName: packageName });
    };
    exports.branches = function (api, project, repo, credentials) {
        return api
            .allBranches(null, { project: project, repo: repo }, { credentials: credentials })
            .then(R.map(exports.serializeBranch));
    };
    function fetch(npm, axios, artifacts, tags, branches, buildCredentials, serializeTags, packageName, project, repo) {
        var api = resolvers_2.resolvers(npm, axios).Query;
        var calls = Promise.all([
            artifacts(api, packageName),
            tags(api, packageName),
            branches(api, project, repo, buildCredentials(config_3["default"].USERNAME, config_3["default"].PASSWORD))
        ]);
        return calls
            .then(function (_a) {
            var versions = _a[0], tags = _a[1], branches = _a[2];
            return {
                artifacts: {
                    tags: serializeTags(tags),
                    versions: versions
                },
                branches: branches,
                pullRequests: {},
                project: {
                    domain: "http://domain/",
                    packageName: packageName,
                    project: project,
                    repo: repo
                },
                tags: exports.latestTags(tags)
            };
        })["catch"](function () {
            return { error: 1 };
        });
    }
    exports.fetch = fetch;
});
define("routes", ["require", "exports", "axios", "libnpm", "ramda", "api/legacy-v1/v1Adapter", "utils"], function (require, exports, axios_2, libnpm_2, R, v1Adapter_1, utils_2) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    var validate = function (prop) {
        return R.ifElse(R.has(prop), R.always(null), R.always("Parameter '" + prop + "' is missing."));
    };
    var v1_dashboard = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var errors, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = R.reject(R.isNil, [
                        validate("package")(req.query),
                        validate("project")(req.query),
                        validate("repo")(req.query)
                    ]);
                    if (!(errors.length === 0)) return [3, 2];
                    return [4, v1Adapter_1.fetch(libnpm_2["default"], axios_2["default"], v1Adapter_1.artifacts, v1Adapter_1.tags, v1Adapter_1.branches, utils_2.buildCredentials, v1Adapter_1.serializeTags, req.query.package, req.query.project, req.query.repo)];
                case 1:
                    data = _a.sent();
                    res.json(data);
                    return [3, 3];
                case 2:
                    res.json({
                        error: 2,
                        errors: errors
                    });
                    _a.label = 3;
                case 3: return [2];
            }
        });
    }); };
    exports.v1_dashboard = v1_dashboard;
});
define("app", ["require", "exports", "cors", "express", "express-graphql", "config", "schema", "utils", "routes"], function (require, exports, cors, express, express_graphql_1, config_4, schema_1, utils_3, routes) {
    "use strict";
    exports.__esModule = true;
    var app = express();
    var PORT = process.env.PORT || 3000;
    var credentials = utils_3.buildCredentials(config_4["default"].USERNAME, config_4["default"].PASSWORD);
    app.use(cors());
    app.options("/graphql", cors());
    app.use("/graphql", express_graphql_1["default"]({
        graphiql: true,
        schema: schema_1["default"],
        context: {
            credentials: credentials
        }
    }));
    app.use("/api/1.0/dashboard", routes.v1_dashboard);
    app.listen(PORT, function () {
        console.log("Server listen " + PORT);
    });
});
define("exampleREST", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        artifacts: {
            tags: {
                alpha: "0.44.1-alpha.ce588872",
                beta: "0.44.1-beta.a28ba5fb",
                latest: "0.44.0"
            },
            versions: [
                {
                    version: "0.44.1-alpha.ce588872",
                    time: "2018-09-27T09:41:34.353Z",
                    tarball: ""
                },
                {
                    version: "0.44.1-beta.a28ba5fb",
                    time: "2018-09-27T09:41:34.353Z",
                    tarball: ""
                },
                { version: "0.44.0", time: "2018-09-27T09:41:34.353Z", tarball: "" }
            ]
        },
        branches: [
            {
                displayId: "feature/feature-1",
                package: "0.44.1-alpha.ce588872",
                artifact: {
                    time: "2018-09-10T14:39:12.263Z",
                    version: "0.44.1-alpha.ce588872",
                    tarball: ""
                }
            }
        ],
        project: {
            domain: "http://domain/",
            packageName: "package-name",
            project: "project-name",
            repo: "repo-name"
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
                version: "0.44.1-alpha.ce588872",
                time: "2018-09-27T09:41:34.353Z",
                tarball: ""
            },
            beta: {
                version: "0.44.1-beta.a28ba5fb",
                time: "2018-09-27T09:41:34.353Z",
                tarball: ""
            },
            latest: {
                version: "0.44.0",
                time: "2018-09-27T09:41:34.353Z",
                tarball: ""
            }
        }
    };
});
define("__mocks__/config", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = {
        COMMITS_URL: "https://service/%project%/%repo%/commits",
        BRANCHES_URL: "https://service/%project%/%repo%/branches",
        NPM_REGISTRY: "https://npm/registry",
        PASSWORD: "password",
        USERNAME: "username"
    };
});
define("__tests__/resolves.test", ["require", "exports", "resolvers"], function (require, exports, resolvers_3) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    jest.mock("../config");
    var npmStubGood = {
        load: function (_1, callback) { return callback(); },
        commands: {
            view: function (_2, _3, callback) {
                return callback(null, {
                    "0.0.1": {
                        "dist-tags": {},
                        time: {},
                        versions: {}
                    }
                });
            }
        }
    };
    var axiosGetGood = {
        get: function () {
            return Promise.resolve({
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
            });
        }
    };
    describe("resolvers", function () {
        describe("allBranches", function () {
            var rlvs;
            beforeEach(function () {
                rlvs = resolvers_3.resolvers(npmStubGood, axiosGetGood);
            });
            it("should work", function () { return __awaiter(_this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, rlvs.Query.allBranches(null, { project: "MY_PROJECT", repo: "MY_REPO" }, { credentials: "" })];
                        case 1:
                            res = _a.sent();
                            expect(res).toStrictEqual([
                                {
                                    _id: "master"
                                }
                            ]);
                            return [2];
                    }
                });
            }); });
        });
    });
});
define("__tests__/utils.test", ["require", "exports", "utils"], function (require, exports, utils_4) {
    "use strict";
    exports.__esModule = true;
    jest.mock("../config");
    describe("utils", function () {
        describe("paramsToQuery", function () {
            it("should return a query string", function () {
                var res = utils_4.paramsToQuery({
                    age: 50,
                    gender: "female"
                });
                expect(res).toBe("?age=50&gender=female");
            });
            it("should return an empty query string when an empty object is passed", function () {
                var res = utils_4.paramsToQuery({});
                expect(res).toBe("");
            });
        });
        describe("headers", function () {
            it("should return a headers object", function () {
                var credentials = "base64string";
                var expected = {
                    headers: {
                        common: {
                            Authorization: "Basic base64string"
                        }
                    }
                };
                expect(utils_4.headers(credentials)).toStrictEqual(expected);
            });
        });
        describe("buildCredentials", function () {
            it("should return the base64 string", function () {
                var res = utils_4.buildCredentials("foo", "bar");
                expect(res).toBe("Zm9vOmJhcg==");
            });
        });
        describe("branchesUrl", function () {
            it("should return a contructed url", function () {
                var input = utils_4.branchesUrl("MY_PROJECT", "MY_REPO");
                var expected = "https://service/MY_PROJECT/MY_REPO/branches";
                expect(input).toBe(expected);
            });
        });
        describe("commitsUrl", function () {
            it("should return a contructed url", function () {
                var input = utils_4.commitsUrl("MY_PROJECT", "MY_REPO", { limit: 100 });
                var expected = "https://service/MY_PROJECT/MY_REPO/commits?limit=100";
                expect(input).toBe(expected);
            });
        });
    });
});
define("api/__tests__/branches.test", ["require", "exports", "api/branches"], function (require, exports, branches_1) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    describe("branches", function () {
        describe("serialize", function () {
            it("should serialize a branch", function () {
                var input = {
                    displayId: "123"
                };
                var x = branches_1.serialize(input);
                expect(x).toStrictEqual({
                    _id: "123"
                });
            });
        });
        describe("find", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it("should return all the branches", function () { return __awaiter(_this, void 0, void 0, function () {
                    var response, axiosGetStubGood, url, headers, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                response = {
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
                                axiosGetStubGood = function () { return Promise.resolve({ data: response }); };
                                url = "https://foo.bar";
                                headers = {};
                                return [4, branches_1.find(axiosGetStubGood, url, headers)];
                            case 1:
                                res = _a.sent();
                                expect(res).toStrictEqual([{ _id: "master" }]);
                                return [2];
                        }
                    });
                }); });
                it("should return an Error when the request fails", function () { return __awaiter(_this, void 0, void 0, function () {
                    var axiosGetStubBad, url, headers, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                axiosGetStubBad = function () { return Promise.reject(new Error("oups!")); };
                                url = "https://foo.bar";
                                headers = {};
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, branches_1.find(axiosGetStubBad, url, headers)];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_3 = _a.sent();
                                expect(e_3).toBeInstanceOf(Error);
                                expect(e_3.message).toBe("oups!");
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
    });
});
define("api/__tests__/commits.test", ["require", "exports", "api/commits"], function (require, exports, commits_1) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    describe("commits", function () {
        describe("serialize", function () {
            it("should serialize a commit", function () {
                var input = {
                    id: "123",
                    authorTimestamp: "4321"
                };
                var x = commits_1.serialize(input);
                expect(x).toStrictEqual({
                    _id: "123",
                    date: "4321"
                });
            });
            it("should return null date if the authorTimestamp is not present", function () {
                var input = {
                    id: "123"
                };
                var x = commits_1.serialize(input);
                expect(x).toStrictEqual({
                    _id: "123",
                    date: null
                });
            });
        });
        describe("find", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it("should return all the commits", function () { return __awaiter(_this, void 0, void 0, function () {
                    var response, axiosGetStubGood, url, headers, expected;
                    return __generator(this, function (_a) {
                        response = {
                            values: [
                                {
                                    id: "6bbe9aab7f181b919c884c25c468e7335bed47f5",
                                    authorTimestamp: 149261208
                                },
                                {
                                    id: "c10483a950c77565f8a4b7e533cb38fffc5b15d4",
                                    authorTimestamp: 149260311
                                }
                            ]
                        };
                        axiosGetStubGood = function () { return Promise.resolve({ data: response }); };
                        url = "https://foo.bar";
                        headers = {};
                        expected = [
                            {
                                _id: "6bbe9aab7f181b919c884c25c468e7335bed47f5",
                                date: 149261208
                            },
                            {
                                _id: "c10483a950c77565f8a4b7e533cb38fffc5b15d4",
                                date: 149260311
                            }
                        ];
                        expect(commits_1.find(axiosGetStubGood, url, headers)).resolves.toStrictEqual(expected);
                        return [2];
                    });
                }); });
                it("should return an Error when the request fails", function () { return __awaiter(_this, void 0, void 0, function () {
                    var axiosGetStubBad, url, headers, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                axiosGetStubBad = function () { return Promise.reject(new Error("oups!")); };
                                url = "https://foo.bar";
                                headers = {};
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, commits_1.find(axiosGetStubBad, url, headers)];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_4 = _a.sent();
                                expect(e_4).toBeInstanceOf(Error);
                                expect(e_4.message).toBe("oups!");
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
    });
});
define("api/__tests__/releases.test", ["require", "exports", "api/releases"], function (require, exports, releases_2) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    describe("releases", function () {
        describe("isAlpha", function () {
            it("should return true when is an alpha release", function () {
                var x = {
                    type: "alpha"
                };
                expect(releases_2.typeIsAlpha(x)).toBe(true);
            });
            it("should return false when is not an alpha release", function () {
                var x = {
                    type: "beta"
                };
                expect(releases_2.typeIsAlpha(x)).toBe(false);
            });
        });
        describe("notVersionNum", function () {
            it("should return true when is not a release", function () {
                expect(releases_2.isCreatedOrModified("created")).toBe(true);
            });
            it("should return true when is not a release", function () {
                expect(releases_2.isCreatedOrModified("modified")).toBe(true);
            });
            it("should return false when is a release", function () {
                expect(releases_2.isCreatedOrModified("1.0.0")).toBe(false);
            });
        });
        describe("serialize", function () {
            it("should serialize a release", function () {
                expect(releases_2.serialize(["1.0.0", "1.0.1", "1.1.0"], { "1.0.1": "2018-05-18T11:17:35.529Z" }, "1.0.1")).toStrictEqual({
                    _id: "1.0.1",
                    version: "1.0.1",
                    date: 1526642255529,
                    tarball: "",
                    type: "release"
                });
            });
        });
        describe("load", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                it("should load all releases", function () { return __awaiter(_this, void 0, void 0, function () {
                    var npmStubGood, res;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                npmStubGood = {
                                    load: function (_1, callback) { return callback(); },
                                    commands: {
                                        view: function (_2, _3, callback) {
                                            return callback(null, {
                                                "0.0.1": {
                                                    "dist-tags": {},
                                                    time: {},
                                                    versions: {}
                                                }
                                            });
                                        }
                                    }
                                };
                                return [4, releases_2.load(npmStubGood, "foo")];
                            case 1:
                                res = _a.sent();
                                expect(res).toStrictEqual({
                                    versions: {},
                                    time: {},
                                    "dist-tags": {}
                                });
                                return [2];
                        }
                    });
                }); });
                it("should fail to load releases", function () { return __awaiter(_this, void 0, void 0, function () {
                    var npmStubBad, e_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                npmStubBad = {
                                    load: function (_1, callback) { return callback(); },
                                    commands: {
                                        view: function (_2, _3, callback) { return callback(new Error("error!")); }
                                    }
                                };
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, releases_2.load(npmStubBad, "foo")];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_5 = _a.sent();
                                expect(e_5).toBeInstanceOf(Error);
                                expect(e_5.message).toBe("error!");
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
        describe("parseReleaseTags", function () {
            it("should parse the release tags", function () {
                var versions = ["1.0.0", "1.0.1", "1.1.0"];
                var timestamps = {
                    created: "2018-05-18T09:01:38.604Z",
                    "1.0.0": "2018-05-18T09:01:38.604Z",
                    modified: "2018-05-18T09:01:38.604Z"
                };
                var distTags = {
                    latest: "1.0.0"
                };
                var res = releases_2.parseReleaseTags(releases_2.typeIsAlpha, versions, timestamps)(distTags);
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
        describe("parseAllReleases", function () {
            it("should parse the release tags", function () {
                var versions = ["1.0.0", "1.0.1", "1.1.0"];
                var timestamps = {
                    created: "2018-05-18T09:01:38.604Z",
                    "1.0.0": "2018-05-18T09:01:39.604Z",
                    "1.0.1": "2018-05-18T09:01:40.604Z",
                    "1.1.0": "2018-05-18T09:01:41.604Z",
                    modified: "2018-05-18T09:01:42.604Z"
                };
                var parse = releases_2.parseAllReleases(releases_2.isCreatedOrModified, versions, timestamps);
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
});
define("api/legacy-v1/__tests__/v1Adapter.test", ["require", "exports", "api/legacy-v1/v1Adapter", "utils"], function (require, exports, v1Adapter_2, utils_5) {
    "use strict";
    var _this = this;
    exports.__esModule = true;
    describe("v1Adapter", function () {
        describe("getId", function () {
            it("should return the value of the _id property", function () {
                expect(v1Adapter_2.getId({ _id: 1 })).toBe(1);
            });
        });
        describe("findAlpha, findBeta, findRelease, serializeTags", function () {
            var tags = [
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
            describe("findAlpha", function () {
                it("should return the object with the alpha type", function () {
                    expect(v1Adapter_2.findAlpha(tags)).toStrictEqual({
                        _id: "0.0.1-alpha.0001",
                        type: "alpha"
                    });
                });
            });
            describe("findBeta", function () {
                it("should return the object with the beta type", function () {
                    expect(v1Adapter_2.findBeta(tags)).toStrictEqual({
                        _id: "0.0.1-beta.0001",
                        type: "beta"
                    });
                });
            });
            describe("findRelease", function () {
                it("should return the object with the latest type", function () {
                    expect(v1Adapter_2.findLatest(tags)).toStrictEqual({
                        _id: "0.0.1",
                        type: "latest"
                    });
                });
            });
            describe("serializeTags", function () {
                it("should serialize raw tags into proper objects", function () {
                    expect(v1Adapter_2.serializeTags(tags)).toStrictEqual({
                        alpha: "0.0.1-alpha.0001",
                        beta: "0.0.1-beta.0001",
                        latest: "0.0.1"
                    });
                });
            });
        });
        describe("serializeRelease", function () {
            it("should serialize raw release into proper object", function () {
                expect(v1Adapter_2.serializeRelease({
                    version: "0.0.1",
                    date: "2018-10-01T11:47:44.344Z",
                    tarball: "http://foo.bar/release.zip"
                })).toStrictEqual({
                    version: "0.0.1",
                    time: "2018-10-01T11:47:44.344Z",
                    tarball: "http://foo.bar/release.zip"
                });
            });
        });
        describe("serializeBranch", function () {
            it("should serialize raw branch into proper object", function () {
                expect(v1Adapter_2.serializeBranch({
                    _id: "master"
                })).toStrictEqual({
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
        describe("artifacts", function () {
            it("should load the artifacts", function () {
                var allArtifacts = [
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
                var apiStubGood = {
                    allReleases: function () { return Promise.resolve(allArtifacts); }
                };
                expect(v1Adapter_2.artifacts(apiStubGood, "foo")).resolves.toStrictEqual([
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
        describe("tags", function () {
            it("should load the tags", function () {
                var allTags = [
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
                var apiStubGood = {
                    allReleaseTags: function () { return Promise.resolve(allTags); }
                };
                expect(v1Adapter_2.tags(apiStubGood, "foo")).resolves.toStrictEqual([
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
        describe("branches", function () {
            it("should load the branches", function () {
                var allBranches = [
                    { _id: "master" },
                    { _id: "feature/feature-1" },
                    { _id: "bugfix/bugfix-1" },
                    { _id: "experiment/experiment-1" }
                ];
                var apiStubGood = {
                    allBranches: function () { return Promise.resolve(allBranches); }
                };
                expect(v1Adapter_2.branches(apiStubGood, "project", "repo", {})).resolves.toStrictEqual([
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
        describe("fetch", function () {
            it.skip("should fetch all the data", function () {
                var npmStubGood = {};
                var axiosStubGood = {};
                var artifactsStub = function () {
                    return Promise.resolve([
                        {
                            tarball: "",
                            time: "2018-05-18T09:01:41.604Z",
                            version: "1.1.0"
                        }
                    ]);
                };
                var tagsStub = function () {
                    return Promise.resolve([
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
                };
                var branchesStub = function () { return Promise.resolve([{ _id: "master" }]); };
                expect(v1Adapter_2.fetch(npmStubGood, axiosStubGood, artifactsStub, tagsStub, branchesStub, utils_5.buildCredentials, v1Adapter_2.serializeTags, "foo", "bar", "baz")).resolves.toStrictEqual({
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
            it("should fail to fetch", function () { return __awaiter(_this, void 0, void 0, function () {
                var npmStubGood, axiosStubGood, artifactsStub, tagsStub, branchesStub, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            npmStubGood = {};
                            axiosStubGood = {};
                            artifactsStub = function () { return Promise.reject(); };
                            tagsStub = function () { return Promise.reject(); };
                            branchesStub = function () { return Promise.reject(); };
                            return [4, v1Adapter_2.fetch(npmStubGood, axiosStubGood, artifactsStub, tagsStub, branchesStub, utils_5.buildCredentials, v1Adapter_2.serializeTags, "foo", "bar", "baz")];
                        case 1:
                            error = (_a.sent()).error;
                            expect(error).toBe(1);
                            return [2];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=index.js.map