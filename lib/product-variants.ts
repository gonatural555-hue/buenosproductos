import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Opción individual de una variante
 */
export interface VariantOption {
  label: string;
  value?: string;
  priceModifier?: number;
  /** Color visual del swatch (PDP + cards). Ej: "#EDE6D6" */
  swatchHex?: string;
  [key: string]: any; // Permite propiedades adicionales (rodType, length, etc.)
}

/**
 * Definición de una variante (ej: Color, Talla, Longitud)
 */
export interface VariantDefinition {
  type: string; // Identificador único del tipo (ej: "color", "size", "length")
  label: string; // Etiqueta para mostrar al usuario
  default?: string; // Valor por defecto (value de una opción)
  options: VariantOption[];
}

/**
 * Matriz de variantes válidas (combinaciones permitidas)
 * Cada objeto representa una combinación válida de valores
 */
export type VariantMatrix = Record<string, string>[];

/**
 * Estructura de variantes en el JSON
 * Puede ser:
 * - Un objeto simple (una variante)
 * - Un array de objetos (múltiples variantes)
 */
export type ProductVariantsData =
  | VariantDefinition
  | VariantDefinition[]
  | {
      variants: VariantDefinition[];
      variantMatrix?: VariantMatrix;
    };

/**
 * Resultado normalizado de variantes
 */
export interface ProductVariants {
  variants: VariantDefinition[];
  variantMatrix?: VariantMatrix;
}

/**
 * Interfaz del JSON del producto
 */
interface ProductJson {
  id: string;
  variants?: ProductVariantsData;
}

/**
 * Obtiene las variantes de un producto desde scripts/products/{productId}.json
 * 
 * @param productId - El ID único del producto (ej: "gn-fishing-001")
 * @returns Objeto con las variantes normalizadas, o null si no hay variantes
 */
export async function getProductVariants(
  productId: string
): Promise<ProductVariants | null> {
  try {
    // Leer desde scripts/products/{productId}.json
    const jsonPath = join(
      process.cwd(),
      "scripts",
      "products",
      `${productId}.json`
    );

    const fileContent = await readFile(jsonPath, "utf-8");
    const productData: ProductJson = JSON.parse(fileContent);

    // Si no hay variantes, retornar null
    if (!productData.variants) {
      return null;
    }

    const variantsData = productData.variants;

    // Normalizar estructura
    let variants: VariantDefinition[] = [];
    let variantMatrix: VariantMatrix | undefined = undefined;

    // Caso 1: Objeto con variants y variantMatrix
    if (
      typeof variantsData === "object" &&
      !Array.isArray(variantsData) &&
      "variants" in variantsData
    ) {
      variants = Array.isArray(variantsData.variants)
        ? variantsData.variants
        : [variantsData.variants];
      variantMatrix = variantsData.variantMatrix;
    }
    // Caso 2: Array de variantes
    else if (Array.isArray(variantsData)) {
      variants = variantsData;
    }
    // Caso 3: Objeto simple (una variante)
    else if (typeof variantsData === "object") {
      variants = [variantsData as VariantDefinition];
    }

    // Validar que haya al menos una variante con opciones
    const validVariants = variants.filter(
      (v) => v.options && Array.isArray(v.options) && v.options.length > 0
    );

    if (validVariants.length === 0) {
      return null;
    }

    return {
      variants: validVariants,
      variantMatrix,
    };
  } catch (error: any) {
    // Archivo no existe o JSON inválido
    if (error.code === "ENOENT") {
      // Archivo no encontrado - esto es normal si el producto no tiene JSON
      return null;
    } else {
      // Error de parsing u otro error
      console.warn(
        `⚠️  Producto ${productId}: Error leyendo variantes - ${error.message}`
      );
      return null;
    }
  }
}

