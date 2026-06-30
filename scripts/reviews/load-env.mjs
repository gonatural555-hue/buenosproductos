import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveEnvPath() {
  const candidates = [
    path.join(process.cwd(), ".env.local"),
    path.join(__dirname, "..", "..", ".env.local"),
    path.join(__dirname, "..", ".env.local"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

/** Carga .env.local sin dependencia extra (solo para scripts locales). */
export function loadEnvLocal() {
  const ENV_PATH = resolveEnvPath();
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error(`Missing .env.local (tried ${ENV_PATH})`);
  }

  const text = fs.readFileSync(ENV_PATH, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

export function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing env var: ${name} (set in .env.local)`);
  }
  return value;
}
