"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import {
  cartLineToGa4Item,
  trackAddToCart,
  trackRemoveFromCart,
} from "@/lib/analytics/ga4";

type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  variantSummary?: string;
  variantSelections?: {
    type: string;
    typeLabel?: string;
    value: string;
    label?: string;
  }[];
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "INCREASE_QTY"; payload: { id: string } }
  | { type: "DECREASE_QTY"; payload: { id: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const qty = Math.max(1, action.payload.quantity ?? 1);
      const { quantity: _q, ...line } = action.payload;
      const existing = state.items.find(
        (item) => item.id === line.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === line.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { ...line, quantity: qty },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => item.id !== action.payload.id
        ),
      };

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

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        dispatch({
          type: "SET_CART",
          payload: JSON.parse(stored),
        });
      }
    } catch {
      // silent fail
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch {
      // silent fail
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    const subtotal = state.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return {
      items: state.items,
      totalItems,
      subtotal,
      addItem: (item) => {
        const qty = Math.max(1, item.quantity ?? 1);
        dispatch({ type: "ADD_ITEM", payload: item });
        trackAddToCart([
          cartLineToGa4Item(
            { id: item.id, title: item.title, price: item.price },
            qty
          ),
        ]);
      },
      removeItem: (id) => {
        const existing = state.items.find((row) => row.id === id);
        if (existing) {
          trackRemoveFromCart([
            cartLineToGa4Item(existing, existing.quantity),
          ]);
        }
        dispatch({ type: "REMOVE_ITEM", payload: { id } });
      },
      increaseQty: (id) => {
        const existing = state.items.find((row) => row.id === id);
        if (existing) {
          trackAddToCart([cartLineToGa4Item(existing, 1)]);
        }
        dispatch({ type: "INCREASE_QTY", payload: { id } });
      },
      decreaseQty: (id) => {
        const existing = state.items.find((row) => row.id === id);
        if (existing && existing.quantity > 0) {
          trackRemoveFromCart([cartLineToGa4Item(existing, 1)]);
        }
        dispatch({ type: "DECREASE_QTY", payload: { id } });
      },
      clearCart: () =>
        dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
