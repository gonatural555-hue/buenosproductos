# Cursor Implementation Prompt — Next.js App Router Ecommerce (TypeScript)

Goal: Implement an App Router Next.js ecommerce project that:
- Reads product JSON files from /data/products
- Reads blog JSON files from /data/blog
- Generates Product Detail Pages (PDP) and Blog pages automatically (SSG)
- Links product → blog and blog → product (explicit links + tag-based fallback)
- Uses a reusable architecture:
  - UI components in /components
  - Data/logic helpers in /lib
  - Types in /types
- Use server components where appropriate and keep client components minimal
- Keep code TypeScript-first

Assumptions:
- Next.js 13.4+ with App Router
- TypeScript enabled
- Data files are plain JSON files placed inside /data/products and /data/blog (one JSON file per entity is preferred)
- No external DB; use Node fs to read JSON on the server
- No CSS system mandated — small sample CSS modules / Tailwind-ready classes OK
- Project root = process.cwd()

Required repository structure (create/update these files):

- /app
  - /products
    - /[slug]
      - page.tsx
    - page.tsx
  - /blog
    - /[slug]
      - page.tsx
    - page.tsx
  - layout.tsx
  - page.tsx
- /components
  - Header.tsx
  - Layout.tsx
  - ProductCard.tsx
  - BlogCard.tsx
  - ProductDetail.tsx
  - RelatedList.tsx
- /lib
  - products.ts
  - blogs.ts
  - links.ts
- /types
  - index.d.ts (or types.ts)
- /data
  - /products/*.json
  - /blog/*.json
- next.config.js (if needed)
- tsconfig.json (if needed)

Data format examples (place a few example JSON files under /data):

- /data/products/widget-a.json
  {
    "slug": "widget-a",
    "title": "Widget A",
    "description": "A great widget.",
    "price": 19.99,
    "images": ["/images/widget-a-1.jpg"],
    "tags": ["widgets", "sale"],
    "relatedBlogSlugs": ["how-to-use-widget-a"] // optional explicit links
  }

- /data/blog/how-to-use-widget-a.json
  {
    "slug": "how-to-use-widget-a",
    "title": "How to use Widget A",
    "excerpt": "Quick guide to Widget A.",
    "content": "<p>Full HTML or markdown-processed content</p>",
    "tags": ["widgets", "guide"],
    "relatedProductSlugs": ["widget-a"] // optional explicit links
  }

Implementation steps (detailed):

1) Types (/types)
- Create TypeScript types for Product and BlogPost.
  - Product: slug, title, description, price (number), images (string[]), tags (string[]), relatedBlogSlugs?: string[]
  - BlogPost: slug, title, excerpt, content, tags (string[]), relatedProductSlugs?: string[]

2) Lib helpers (/lib)
- Create functions that read JSON files from /data directories and parse them.

lib/products.ts (key exports)
- getAllProducts(): Promise<Product[]>
  - Read all files in /data/products, parse JSON, return sorted list (by title or slug)
- getProductBySlug(slug: string): Promise<Product | null>
- generateProductParams(): Promise<{ slug: string }[]>
  - Used by generateStaticParams in app route

lib/blogs.ts (key exports)
- getAllBlogs(): Promise<BlogPost[]>
- getBlogBySlug(slug: string): Promise<BlogPost | null>
- generateBlogParams(): Promise<{ slug: string }[]>

lib/links.ts
- findRelatedBlogsForProduct(product: Product, allBlogs: BlogPost[]): BlogPost[]
  - Priority:
    1. If product.relatedBlogSlugs present → map those slugs to blogs (maintain order)
    2. Else fallback: find blogs with tag intersection with product.tags, sort by count of matched tags
- findRelatedProductsForBlog(blog: BlogPost, allProducts: Product[]): Product[]
  - Mirror logic for blog.relatedProductSlugs then tag-based fallback

Implementation details for reading files:
- Use import fs from 'fs/promises' and path from 'path'
- const productsDir = path.join(process.cwd(), 'data', 'products')
- Read all files with fs.readdir(productsDir), filter *.json, read and JSON.parse each
- Use server-only code (these modules will be imported from server components)

3) App routes (SSG + generateStaticParams)
- Use generateStaticParams in app/products/[slug]/page.tsx and app/blog/[slug]/page.tsx to pre-render all pages.

Example for products route:
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const blogs = await getAllBlogs()
  const relatedBlogs = findRelatedBlogsForProduct(product, blogs)
  return (
    <Layout>
      <ProductDetail product={product} />
      <RelatedList items={relatedBlogs} type="blog" />
    </Layout>
  )
}

- Blog route analogous.

4) Pages
- /app/products/page.tsx
  - Server component that lists products using ProductCard (map on getAllProducts()) and links to /products/[slug]
- /app/blog/page.tsx
  - List all blog posts using BlogCard linking to /blog/[slug]
- Root /app/page.tsx
  - Basic home that links to products and blog index

5) Components (/components)
- ProductCard.tsx
  - Props: product: Product
  - Renders title, price, thumbnail, link to /products/[slug]
  - Keep it a client component only if using state/hydration; prefer server component with <Link> (Next.js Link is server-safe)
- BlogCard.tsx
  - Props: blog: BlogPost
  - Renders title, excerpt, link to /blog/[slug]
- ProductDetail.tsx
  - Props: product: Product
  - Show images, price, description
  - Include a RelatedBlogs section (but actual data passed from page component)
- RelatedList.tsx
  - Reusable list to render items (either ProductCard or BlogCard) with a "Related" title
- Header/Layout
  - Basic Layout component in /components/Layout.tsx used by app/layout.tsx

Constraints for components:
- Keep them presentational and accept props only
- Place all components under /components
- Avoid business logic in components; call into /lib from pages

6) Linking behavior (detailed)
- Primary linking uses explicit arrays:
  - product.relatedBlogSlugs → show those blogs on PDP
  - blog.relatedProductSlugs → show those products on blog page
- Fallback linking uses tag intersection:
  - For each other entity, compute set intersection size between tags arrays
  - Rank descending by intersection size, optionally limit to N (e.g., 3)
  - Optionally dedupe explicit + fallback results
- Use stable deterministic ordering (explicit order preserved)

7) Example code snippets (key files)
- Provide these as part of the task to implement:

/types/index.d.ts (or types.ts)
export type Product = {
  slug: string
  title: string
  description: string
  price: number
  images?: string[]
  tags?: string[]
  relatedBlogSlugs?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt?: string
  content?: string
  tags?: string[]
  relatedProductSlugs?: string[]
}

/lib/products.ts
import fs from 'fs/promises'
import path from 'path'
import { Product } from '../types'

const dir = path.join(process.cwd(), 'data', 'products')

export async function getAllProducts(): Promise<Product[]> {
  const files = await fs.readdir(dir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))
  const products = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), 'utf-8')
      return JSON.parse(raw) as Product
    })
  )
  return products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find(p => p.slug === slug) ?? null
}

export async function generateProductParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

/lib/blogs.ts
// mirror of products.ts for blog posts

/lib/links.ts
import { Product, BlogPost } from '../types'

export function findRelatedBlogsForProduct(product: Product, blogs: BlogPost[], limit = 3): BlogPost[] {
  const explicit = (product.relatedBlogSlugs || [])
    .map(slug => blogs.find(b => b.slug === slug))
    .filter(Boolean) as BlogPost[]
  if (explicit.length) return explicit.slice(0, limit)

  const scores = blogs.map(b => {
    const shared = (b.tags || []).filter(t => (product.tags || []).includes(t)).length
    return { blog: b, score: shared }
  }).filter(x => x.score > 0)
  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, limit).map(x => x.blog)
}

export function findRelatedProductsForBlog(blog: BlogPost, products: Product[], limit = 3): Product[] {
  const explicit = (blog.relatedProductSlugs || [])
    .map(slug => products.find(p => p.slug === slug))
    .filter(Boolean) as Product[]
  if (explicit.length) return explicit.slice(0, limit)

  const scores = products.map(p => {
    const shared = (p.tags || []).filter(t => (blog.tags || []).includes(t)).length
    return { product: p, score: shared }
  }).filter(x => x.score > 0)
  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, limit).map(x => x.product)
}

/app/products/[slug]/page.tsx (outline)
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProducts } from '../../../lib/products'
import { getAllBlogs } from '../../../lib/blogs'
import { findRelatedBlogsForProduct } from '../../../lib/links'
import ProductDetail from '../../../components/ProductDetail'
import RelatedList from '../../../components/RelatedList'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()
  const blogs = await getAllBlogs()
  const related = findRelatedBlogsForProduct(product, blogs)
  return (
    <div>
      <ProductDetail product={product} />
      <RelatedList items={related} type="blog" />
    </div>
  )
}

Repeat same structure for blog pages.

/app/products/page.tsx
- List products and link to detail pages

8) Pagination / Limits
- Initially generate full indexes; if dataset grows consider pagination.
- Keep related item limits to configurable values in link helpers.

9) Testing / Acceptance Criteria
- All product files under /data/products/*.json render at /products/[slug] with product content
- All blog files under /data/blog/*.json render at /blog/[slug] with blog content
- Product page shows related blog links (explicit or tag-based)
- Blog page shows related product links (explicit or tag-based)
- All components exist in /components; no heavy logic inside components
- All data-reading logic resides in /lib
- generateStaticParams implemented for both products and blog to statically generate pages

10) Deliverable checklist for Cursor
- Create all files listed above with TypeScript implementations
- Provide basic CSS/structure so pages are readable
- Include at least two sample product JSONs and two blog JSONs in /data to validate linking behavior
- Ensure imports use absolute or relative paths consistent with a typical Next.js project
- Ensure Node-only fs usage is only in server modules (lib), not in client components

Edge cases and notes:
- If slug file not found, call notFound() from next/navigation (server-side)
- Sanitize JSON parsing errors gracefully (log or throw to fail build)
- If tags arrays missing, treat them as empty arrays
- Ensure duplicate related results are deduped when merging explicit + fallback

End of prompt. Implement the above, output code files into project structure, and verify by running Next.js dev server.