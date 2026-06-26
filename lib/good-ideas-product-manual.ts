import { readFileSync } from "fs";
import { join } from "path";

export type GoodIdeasProductManual = {
  url: string;
  filename: string;
};

interface GoodIdeasProductJsonWithManual {
  id: string;
  manual?: {
    url?: string;
    filename?: string;
  };
}

const GI_PRODUCTS_JSON_DIR = join(process.cwd(), "scripts", "good-ideas-products");

/**
 * Manual de uso desde `scripts/good-ideas-products/{id}.json` → `manual`.
 */
export function getGoodIdeasProductManual(
  productId: string
): GoodIdeasProductManual | null {
  try {
    const jsonPath = join(GI_PRODUCTS_JSON_DIR, `${productId}.json`);
    const fileContent = readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(fileContent) as GoodIdeasProductJsonWithManual;

    if (data.id !== productId) return null;

    const url = data.manual?.url?.trim();
    if (!url || !url.startsWith("/")) return null;

    const filename =
      data.manual?.filename?.trim() ||
      `${productId}-user-manual.pdf`;

    return { url, filename };
  } catch {
    return null;
  }
}
