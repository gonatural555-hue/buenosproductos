"use client";

import GoodIdeasCartDrawer from "@/components/good-ideas/GoodIdeasCartDrawer";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import { buildCartLineId } from "@/lib/cart-line-id";
import type { GoodIdeasCartDrawerLine } from "@/lib/good-ideas-cart-drawer";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "good-ideas-cart";

export type CartVariantSelection = {
  type: string;
  typeLabel?: string;
  value: string;
  label?: string;
};

export type CartItem = {
  /** Clave de línea (producto + variantes) */
  id: string;
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  variantSelections?: CartVariantSelection[];
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "INCREASE_QTY"; payload: { id: string } }
  | { type: "DECREASE_QTY"; payload: { id: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.id !== action.payload.id) };
    case "INCREASE_QTY":
      return {
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case "DECREASE_QTY":
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return initialState;
    case "SET_CART":
      return action.payload;
    default:
      return state;
  }
}

type GoodIdeasCartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  lastAddedLine: GoodIdeasCartDrawerLine | null;
  addItem: (item: AddToCartLinePayload) => void;
  addItemAndOpenDrawer: (item: AddToCartLinePayload) => void;
  openDrawer: (line: GoodIdeasCartDrawerLine) => void;
  closeDrawer: () => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

const GoodIdeasCartContext = createContext<GoodIdeasCartContextValue | null>(null);

function toDrawerLine(item: AddToCartLinePayload): GoodIdeasCartDrawerLine {
  return {
    title: item.title,
    price: item.price,
    image: item.image,
    variantSelections: item.variantSelections,
  };
}

function payloadToCartItem(item: AddToCartLinePayload): Omit<CartItem, "quantity"> {
  const lineId = buildCartLineId(item.id, item.variantSelections);
  return {
    id: lineId,
    productId: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    variantSelections: item.variantSelections,
  };
}

function normalizeStoredCart(raw: unknown): CartState {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as CartState).items)) {
    return initialState;
  }
  const items = (raw as CartState).items
    .map((item) => {
      if (!item?.title || typeof item.price !== "number") return null;
      const productId = item.productId ?? item.id;
      const lineId =
        item.id?.includes("__") || !item.productId
          ? item.id
          : buildCartLineId(productId, item.variantSelections);
      const normalized: CartItem = {
        id: lineId,
        productId,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: Math.max(1, Number(item.quantity) || 1),
        variantSelections: item.variantSelections,
      };
      return normalized;
    })
    .filter((item): item is CartItem => item !== null);
  return { items };
}

export function GoodIdeasCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedLine, setLastAddedLine] = useState<GoodIdeasCartDrawerLine | null>(
    null
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "SET_CART", payload: normalizeStoredCart(JSON.parse(stored)) });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const openDrawer = useCallback((line: GoodIdeasCartDrawerLine) => {
    setLastAddedLine(line);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const addItemAndOpenDrawer = useCallback(
    (item: AddToCartLinePayload) => {
      dispatch({
        type: "ADD_ITEM",
        payload: payloadToCartItem(item),
      });
      openDrawer(toDrawerLine(item));
    },
    [openDrawer]
  );

  const value = useMemo<GoodIdeasCartContextValue>(() => {
    const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = state.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return {
      items: state.items,
      totalItems,
      subtotal,
      isDrawerOpen,
      lastAddedLine,
      addItem: (item) =>
        dispatch({ type: "ADD_ITEM", payload: payloadToCartItem(item) }),
      addItemAndOpenDrawer,
      openDrawer,
      closeDrawer,
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      increaseQty: (id) => dispatch({ type: "INCREASE_QTY", payload: { id } }),
      decreaseQty: (id) => dispatch({ type: "DECREASE_QTY", payload: { id } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [
    addItemAndOpenDrawer,
    closeDrawer,
    isDrawerOpen,
    lastAddedLine,
    openDrawer,
    state.items,
  ]);

  return (
    <GoodIdeasCartContext.Provider value={value}>
      {children}
      <GoodIdeasCartDrawer />
    </GoodIdeasCartContext.Provider>
  );
}

export function useGoodIdeasCart() {
  const context = useContext(GoodIdeasCartContext);
  if (!context) {
    throw new Error("useGoodIdeasCart must be used within GoodIdeasCartProvider");
  }
  return context;
}
