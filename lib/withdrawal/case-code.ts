import { randomBytes } from "node:crypto";

/** Código legible para el consumidor (ej. AR-A1B2C3D4). */
export function generateWithdrawalCaseCode(): string {
  return `AR-${randomBytes(4).toString("hex").toUpperCase()}`;
}
