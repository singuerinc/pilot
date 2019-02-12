import axios from "axios";
import npm from "libnpm";
import * as R from "ramda";
import {
  artifacts,
  branches,
  fetch,
  serializeTags,
  tags
} from "./api/legacy-v1/v1Adapter";
import { buildCredentials } from "./utils";

const validate = (prop: string) =>
  R.ifElse(
    R.has(prop),
    R.always(null),
    R.always(`Parameter '${prop}' is missing.`)
  );

const v1_dashboard = async (
  req: { query: { package: string; project: string; repo: string } },
  res: { json: (obj: object) => void }
) => {
  const errors = R.reject(R.isNil, [
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
