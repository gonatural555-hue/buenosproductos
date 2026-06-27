/** Hero imagery for home category cards — aligned with category pages */
export const HOME_CATEGORY_IMAGE: Record<string, string> = {
  "outdoor-adventure":
    "/assets/images/categories/outdoor/outdoor-aventura-home-intention.png",
  "mountain-snow": "/assets/images/categories/mountain-snow.webp",
  "water-sports": "/assets/images/categories/water-sports.webp",
  "active-sports": "/assets/images/categories/active-sports.webp",
  fishing: "/assets/images/categories/fishing/pesca-home-intention.png",
};

/** object-position por imageKey (default: center). */
export const HOME_CATEGORY_IMAGE_OBJECT_POSITION: Partial<
  Record<string, string>
> = {
  "outdoor-adventure": "bottom",
};
