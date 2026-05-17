"use client";

import { useState, useCallback } from "react";

// ============================================================
// useLoading — wrap async calls with loading state
// ============================================================
export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, withLoading };
}

// ============================================================
// useDisclosure — open/close boolean (modal, drawer, etc.)
// ============================================================
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open    = useCallback(() => setIsOpen(true),  []);
  const close   = useCallback(() => setIsOpen(false), []);
  const toggle  = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}

// ============================================================
// useAsync — generic async state handler
// ============================================================
interface AsyncState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
}

export function useAsync<T>(initialData: T | null = null) {
  const [state, setState] = useState<AsyncState<T>>({
    data:    initialData,
    loading: false,
    error:   null,
  });

  const run = useCallback(async (fn: () => Promise<T>) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
      return data;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Có lỗi xảy ra";
      setState((s) => ({ ...s, loading: false, error: msg }));
      throw e;
    }
  }, []);

  return { ...state, run };
}