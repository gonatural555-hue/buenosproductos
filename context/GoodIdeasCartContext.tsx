"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

const STORAGE_KEY = "good-ideas-cart";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
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
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

const GoodIdeasCartContext = createContext<GoodIdeasCartContextValue | null>(null);

export function GoodIdeasCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "SET_CART", payload: JSON.parse(stored) });
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
      addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      increaseQty: (id) => dispatch({ type: "INCREASE_QTY", payload: { id } }),
      decreaseQty: (id) => dispatch({ type: "DECREASE_QTY", payload: { id } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return (
    <GoodIdeasCartContext.Provider value={value}>
      {children}
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
