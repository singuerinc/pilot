import axios from "axios";
import npm from "npm";
import always from "ramda/src/always";
import has from "ramda/src/has";
import ifElse from "ramda/src/ifElse";
import isNil from "ramda/src/isNil";
import reject from "ramda/src/reject";
import {
  artifacts,
  branches,
  fetch,
  serializeTags,
  tags
} from "./api/legacy-v1/v1Adapter";
import { buildCredentials } from "./utils";

const validate = (prop) =>
  ifElse(has(prop), always(null), always(`Parameter '${prop}' is missing.`));

const v1_dashboard = async (req, res) => {
  const errors = reject(isNil, [
    validate("package")(req.query),
    validate("project")(req.query),
    validate("repo")(req.query)
  ]);

  if (errors.length === 0) {
    const data = await fetch(
      npm,
      axios,
      artifacts,
      tags,
      branches,
      buildCredentials,
      serializeTags,
      req.query.package,
      req.query.project,
      req.query.repo
    );
    res.json(data);
  } else {
    res.json({
      error: 2,
      errors
    });
  }
};

export { v1_dashboard };
