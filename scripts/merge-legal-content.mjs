/**
 * Merge scripts/legal-content-{locale}.json into messages/{locale}.json
 * Usage: node scripts/merge-legal-content.mjs [es|en|all]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function mergeLocale(locale) {
  const messagesPath = path.join(root, "messages", `${locale}.json`);
  const legalPath = path.join(__dirname, `legal-content-${locale}.json`);

  if (!fs.existsSync(legalPath)) {
    console.warn(`Skip ${locale}: ${legalPath} not found`);
    return;
  }

  const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));
  const legal = JSON.parse(fs.readFileSync(legalPath, "utf8"));
  messages.legal = legal;
  fs.writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Merged legal content into messages/${locale}.json`);
}

const arg = process.argv[2] ?? "all";
if (arg === "all") {
  mergeLocale("es");
  mergeLocale("en");
} else {
  mergeLocale(arg);
}
