'use client';

import { useUIStore } from "@/store/zustandStore";
import { GlobalOverlayLoading } from "@/components/ui/loaders";

export default function GlobalLoadingWrapper() {
  // Lắng nghe state từ store Zustand 
  const globalLoading = useUIStore((state) => state.globalLoading);

  if (!globalLoading) return null;

  return <GlobalOverlayLoading />;
}