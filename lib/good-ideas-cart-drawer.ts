export type GoodIdeasCartDrawerLine = {
  title: string;
  price: number;
  image?: string;
  variantSelections?: {
    type: string;
    typeLabel?: string;
    value: string;
    label?: string;
  }[];
};

export const GI_CART_DRAWER_MS = 250;
