import axios from "axios";
import npm from "npm";
import always from "ramda/src/always";
import has from "ramda/src/has";
import reject from "ramda/src/reject";
import isNil from "ramda/src/isNil";
import ifElse from "ramda/src/ifElse";
import { fetch } from "./api/legacy-v1/v1Adapter";

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
