/**
 * Sistema tipográfico Good Products — Inter (body) + Tan Nimbus (display editorial).
 * Usar tokens semánticos; no hardcodear tamaños/pesos en componentes GI.
 */
export const giType = {
  /** Logo y nombre de marca */
  brandLogo: "font-display text-xl tracking-[var(--gi-tracking-tight)]",

  /** Nav principal — estilo Ninja */
  navLink:
    "font-body text-sm font-semibold uppercase tracking-[var(--gi-tracking-tight)] transition-colors duration-200",
  navUtility:
    "font-body text-xs font-medium tracking-normal transition-colors duration-200",

  /** Breadcrumbs */
  breadcrumbNav: "font-body text-xs font-normal",
  breadcrumbLink:
    "font-body text-xs font-normal text-[var(--gi-text-muted)] transition-colors hover:text-[var(--gi-text-secondary)]",
  breadcrumbCurrent: "font-body text-xs font-normal text-[var(--gi-text-muted)]",
  breadcrumbSep: "mx-2 text-[var(--gi-text-muted)]/45 select-none",

  /** PDP */
  productTitle:
    "font-body text-[length:var(--gi-text-product-title)] font-bold leading-[var(--gi-leading-heading)] tracking-[var(--gi-tracking-tight)] line-clamp-2",
  productMeta:
    "font-body text-sm font-normal leading-relaxed text-[var(--gi-text-secondary)]",
  productPrice:
    "font-body text-2xl font-bold tabular-nums tracking-[var(--gi-tracking-tight)]",
  productDescription:
    "font-body text-base font-normal leading-[var(--gi-leading-relaxed)] max-w-prose text-[var(--gi-text-secondary)]",
  badge: "font-body text-xs font-medium tracking-normal",

  /** Product cards */
  cardTitle:
    "font-body text-base font-semibold leading-snug tracking-[var(--gi-tracking-tight)]",
  cardPrice: "font-body text-base font-bold tabular-nums",
  cardSecondary:
    "font-body text-sm font-normal leading-relaxed text-[var(--gi-text-muted)]",
  cardCategory: "font-body text-xs font-medium text-[var(--gi-primary)]",
  cardCta:
    "font-body text-xs font-medium text-[var(--gi-text-muted)] transition group-hover:text-[var(--gi-primary)]",

  /** Cart drawer */
  drawerTitle: "font-body text-xl font-bold leading-tight",
  drawerProduct: "font-body text-[15px] font-semibold leading-snug sm:text-base",
  drawerMeta: "font-body text-[13px] font-normal text-[var(--gi-text-muted)]",
  drawerPrice: "font-body text-lg font-bold tabular-nums",
  drawerSuccess: "font-body text-[13px] font-medium text-[var(--gi-success)]",
  drawerBtn: "font-body text-sm font-semibold tracking-normal",

  /** Botones */
  btn: "font-body text-sm font-semibold tracking-normal",
  btnSm: "font-body text-xs font-semibold tracking-normal",

  /** Formularios */
  input: "font-body text-sm font-normal",
  label: "font-body text-xs font-medium text-[var(--gi-text-muted)]",
  select: "font-body text-sm font-normal",

  /** Footer */
  footerHeading: "font-body text-sm font-semibold",
  footerLink:
    "font-body text-sm font-normal text-[var(--gi-text-secondary-on-dark)] transition-colors hover:text-[var(--gi-text-on-dark)]",
  footerBody:
    "font-body text-sm font-normal leading-relaxed text-[var(--gi-text-muted-on-dark)]",
  footerLegal:
    "font-body text-xs font-normal text-[var(--gi-text-muted-on-dark)]",

  /** PLP / filtros */
  filterHeading: "font-body text-sm font-semibold",
  filterLink:
    "font-body text-sm font-normal text-[var(--gi-text-secondary)] transition-colors hover:text-[var(--gi-primary)]",
  filterLinkActive: "font-body text-sm font-semibold text-[var(--gi-primary)]",

  /** Títulos editoriales (Tan Nimbus) */
  editorialHero:
    "font-display text-[clamp(2rem,5vw,4rem)] font-normal leading-[0.92] tracking-[var(--gi-tracking-tight)]",
  editorialSection:
    "font-display text-[clamp(1.5rem,3vw,2.25rem)] font-normal tracking-[var(--gi-tracking-tight)]",
  pageTitle:
    "font-display text-[clamp(2rem,5vw,3rem)] font-normal tracking-[var(--gi-tracking-tight)]",
} as const;
