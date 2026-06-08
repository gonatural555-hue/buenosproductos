"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import {
  countPaidOrders,
  getWelcomeFreeShippingRemaining,
} from "@/lib/shipping/welcome-free-shipping";

export type UserProfile = {
  name: string;
  email: string;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  address: Address;
  date: string;
  status: string;
  paymentMethod?: "paypal" | "whatsapp";
  paypalOrderId?: string;
};

type DbAddressRow = {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

function rowToAddress(row: DbAddressRow): Address {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2 || undefined,
    city: row.city,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: row.is_default,
  };
}

function addressToRow(
  userId: string,
  addr: Address
): Record<string, unknown> {
  return {
    user_id: userId,
    full_name: addr.fullName,
    phone: addr.phone,
    address_line1: addr.addressLine1,
    address_line2: addr.addressLine2 || null,
    city: addr.city,
    postal_code: addr.postalCode,
    country: addr.country,
    is_default: addr.isDefault,
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type UserState = {
  authLoading: boolean;
  sessionUser: SupabaseUser | null;
  user: UserProfile | null;
  addresses: Address[];
  orders: Order[];
  lastOrderId?: string | null;
};

type UserContextValue = UserState & {
  isLoggedIn: boolean;
  login: (payload: {
    email: string;
    password: string;
  }) => Promise<{ error: string | null }>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{
    error: string | null;
    needsEmailConfirmation?: boolean;
    pendingEmail?: string;
  }>;
  logout: () => Promise<void>;
  setAddresses: (next: Address[]) => void;
  upsertAddress: (next: Address) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  addOrder: (order: Order) => void;
  refreshOrders: () => Promise<void>;
  welcomeFreeShippingRemaining: number;
  hasWelcomeFreeShipping: boolean;
};

const LAST_ORDER_KEY = "gn-last-order-id";

const UserContext = createContext<UserContextValue | undefined>(undefined);

const normalizeDefault = (list: Address[], selectedId?: string | null) => {
  if (!selectedId) return list;
  return list.map((addr) => ({ ...addr, isDefault: addr.id === selectedId }));
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddressesState] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const loadAddresses = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", uid)
      .order("is_default", { ascending: false });
    if (error) {
      console.error("[UserContext] addresses load", error);
      return;
    }
    const mapped = (data as DbAddressRow[]).map(rowToAddress);
    setAddressesState(mapped);
  }, []);

  const loadOrders = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    const { data: orderRows, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        status,
        subtotal,
        currency,
        payment_method,
        paypal_order_id,
        shipping_json,
        created_at,
        order_items ( product_id, title, price, quantity )
      `
      )
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[UserContext] orders load", error);
      return;
    }
    type ItemRow = {
      product_id: string;
      title: string;
      price: number;
      quantity: number;
    };
    type OrderRow = {
      id: string;
      status: string;
      subtotal: number;
      payment_method: string | null;
      paypal_order_id: string | null;
      shipping_json: Address | Record<string, unknown> | null;
      created_at: string;
      order_items: ItemRow[] | null;
    };
    const mapped: Order[] = (orderRows as OrderRow[] | null)?.map((row) => {
      const ship = row.shipping_json as Address | null;
      const items = (row.order_items || []).map((it) => ({
        id: it.product_id,
        title: it.title,
        price: Number(it.price),
        quantity: it.quantity,
      }));
      const fallbackAddr: Address = {
        id: "snap",
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        postalCode: "",
        country: "",
        isDefault: true,
      };
      return {
        id: row.id,
        items,
        subtotal: Number(row.subtotal),
        address: ship && ship.fullName ? ship : fallbackAddr,
        date: row.created_at,
        status: row.status,
        paymentMethod:
          row.payment_method === "whatsapp" ? "whatsapp" : "paypal",
        paypalOrderId: row.paypal_order_id || undefined,
      };
    }) ?? [];
    setOrders(mapped);
  }, []);

  const hydrateFromSession = useCallback(
    async (su: SupabaseUser | null) => {
      setSessionUser(su);
      if (!su) {
        setUser(null);
        setAddresses([]);
        setOrders([]);
        setAuthLoading(false);
        return;
      }
      const meta = su.user_metadata as { name?: string } | undefined;
      setUser({
        name: meta?.name || su.email?.split("@")[0] || "Usuario",
        email: su.email || "",
      });
      await Promise.all([loadAddresses(su.id), loadOrders(su.id)]);
      setAuthLoading(false);
    },
    [loadAddresses, loadOrders]
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      void hydrateFromSession(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        void hydrateFromSession(session?.user ?? null);
      }
    );

    try {
      const stored = sessionStorage.getItem(LAST_ORDER_KEY);
      if (stored) setLastOrderId(stored);
    } catch {
      /* ignore */
    }

    return () => subscription.unsubscribe();
  }, [hydrateFromSession]);

  useEffect(() => {
    if (lastOrderId) {
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, lastOrderId);
      } catch {
        /* ignore */
      }
    }
  }, [lastOrderId]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!isSupabaseConfigured()) {
        return { error: "Supabase no está configurado." };
      }
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    },
    []
  );

  const register = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      if (!isSupabaseConfigured()) {
        return { error: "Supabase no está configurado." };
      }
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) {
        return { error: error.message };
      }
      if (data.session) {
        return { error: null, needsEmailConfirmation: false };
      }
      const pendingEmail = data.user?.email ?? email;
      return {
        error: null,
        needsEmailConfirmation: true,
        pendingEmail,
      };
    },
    []
  );

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setLastOrderId(null);
    try {
      sessionStorage.removeItem(LAST_ORDER_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /** Reemplazo local completo (casos excepcionales); preferir upsertAddress. */
  const setAddresses = useCallback((next: Address[]) => {
    setAddressesState(next);
  }, []);

  const upsertAddress = useCallback(
    async (addr: Address) => {
      if (!sessionUser?.id || !isSupabaseConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      const base = addressToRow(sessionUser.id, addr);

      if (addr.isDefault) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", sessionUser.id);
      }

      if (UUID_RE.test(addr.id)) {
        const { error } = await supabase
          .from("addresses")
          .update({
            ...base,
            user_id: sessionUser.id,
            is_default: addr.isDefault,
          })
          .eq("id", addr.id)
          .eq("user_id", sessionUser.id);
        if (error) console.error("[UserContext] address update", error);
      } else {
        const { data, error } = await supabase
          .from("addresses")
          .insert(base)
          .select("id")
          .single();
        if (error) {
          console.error("[UserContext] address insert", error);
          return;
        }
        if (data?.id) {
          addr = { ...addr, id: data.id as string };
        }
      }
      await loadAddresses(sessionUser.id);
    },
    [sessionUser, loadAddresses]
  );

  const removeAddress = useCallback(
    async (id: string) => {
      if (!sessionUser?.id || !isSupabaseConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", sessionUser.id);
      if (error) console.error("[UserContext] address delete", error);
      await loadAddresses(sessionUser.id);
    },
    [sessionUser, loadAddresses]
  );

  const setDefaultAddress = useCallback(
    async (id: string) => {
      if (!sessionUser?.id || !isSupabaseConfigured()) return;
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", sessionUser.id);
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", sessionUser.id);
      if (error) console.error("[UserContext] set default", error);
      await loadAddresses(sessionUser.id);
    },
    [sessionUser, loadAddresses]
  );

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setLastOrderId(order.id);
  }, []);

  const refreshOrders = useCallback(async () => {
    if (sessionUser?.id) await loadOrders(sessionUser.id);
  }, [sessionUser, loadOrders]);

  const isLoggedIn = Boolean(sessionUser && user);

  const welcomeFreeShippingRemaining = useMemo(
    () =>
      isLoggedIn
        ? getWelcomeFreeShippingRemaining(countPaidOrders(orders))
        : 0,
    [isLoggedIn, orders]
  );

  const hasWelcomeFreeShipping = welcomeFreeShippingRemaining > 0;

  const value = useMemo<UserContextValue>(
    () => ({
      authLoading,
      sessionUser,
      user,
      addresses,
      orders,
      lastOrderId,
      isLoggedIn,
      login,
      register,
      logout,
      setAddresses,
      upsertAddress,
      removeAddress,
      setDefaultAddress,
      addOrder,
      refreshOrders,
      welcomeFreeShippingRemaining,
      hasWelcomeFreeShipping,
    }),
    [
      authLoading,
      sessionUser,
      user,
      addresses,
      orders,
      lastOrderId,
      isLoggedIn,
      login,
      register,
      logout,
      setAddresses,
      upsertAddress,
      removeAddress,
      setDefaultAddress,
      addOrder,
      refreshOrders,
      welcomeFreeShippingRemaining,
      hasWelcomeFreeShipping,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
