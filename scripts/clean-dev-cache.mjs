import fs from "fs";
import path from "path";

const nextDir = path.join(process.cwd(), ".next");

if (!fs.existsSync(nextDir)) {
  console.log(".next not found — nothing to clean");
  process.exit(0);
}

try {
  fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
  console.log("Removed .next cache");
} catch (err) {
  console.error(
    "Could not remove .next — stop `npm run dev` first, then run dev:clean again."
  );
  if (err instanceof Error) console.error(err.message);
  process.exit(1);
}
