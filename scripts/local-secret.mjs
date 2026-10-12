import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
const path = "services/api/.dev.vars";
if (!existsSync(path))
  writeFileSync(path, `ADMIN_TOKEN=${randomBytes(32).toString("hex")}\n`, {
    mode: 0o600,
  });
console.log("Local admin secret file is configured; value not printed.");
