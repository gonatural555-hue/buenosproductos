/** Catálogo Good Ideas — stub vacío hasta importar SKUs propios. */
export type GoodIdeasProduct = {
  id: string;
  title: string;
  price: number;
  image?: string;
};

export function getGoodIdeasProducts(): GoodIdeasProduct[] {
  return [];
}

export function getGoodIdeasProductById(id: string): GoodIdeasProduct | undefined {
  return getGoodIdeasProducts().find((p) => p.id === id);
}
