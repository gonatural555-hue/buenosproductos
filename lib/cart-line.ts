export type AddToCartLinePayload = {
  id: string;
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
