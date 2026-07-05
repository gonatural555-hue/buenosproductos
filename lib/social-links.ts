/**
 * URLs públicas de redes (Next inyecta `NEXT_PUBLIC_*` en cliente y servidor).
 * Valores por defecto: cuentas oficiales de Buenos Productos.
 * Podés sobreescribir en `.env.local` o en Vercel si cambian.
 */
const DEFAULT_FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61591677233358";
const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/buenosproductos_tienda/";
const DEFAULT_TIKTOK_URL = "https://www.tiktok.com/@buenosproductos.tienda";

export const FACEBOOK_URL = (
  process.env.NEXT_PUBLIC_FACEBOOK_URL || DEFAULT_FACEBOOK_URL
).trim();

export const INSTAGRAM_URL = (
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULT_INSTAGRAM_URL
).trim();

export const TIKTOK_URL = (
  process.env.NEXT_PUBLIC_TIKTOK_URL || DEFAULT_TIKTOK_URL
).trim();

export const YOUTUBE_URL = (process.env.NEXT_PUBLIC_YOUTUBE_URL || "").trim();

export const SPOTIFY_URL = (process.env.NEXT_PUBLIC_SPOTIFY_URL || "").trim();

export const PINTEREST_URL = (process.env.NEXT_PUBLIC_PINTEREST_URL || "").trim();
