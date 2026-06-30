/** Filas en Supabase `product_reviews` (schema real del proyecto). */



export type ProductReviewRow = {

  id: string;

  product_id: string;

  rating: number;

  title?: string | null;

  /** Columna real en Supabase */

  text?: string | null;

  /** Columna real en Supabase */

  author?: string | null;

  country?: string | null;

  images?: string[] | null;

  created_at: string;

};



export type ProductVideoRow = {

  id: string;

  product_id: string;

  url: string;

  thumbnail_url?: string | null;

  title?: string | null;

  platform?: string | null;

  created_at: string;

};



export type ProductRelationRow = {

  id: string;

  product_id: string;

  related_product_id: string;

  sort_order?: number | null;

};


