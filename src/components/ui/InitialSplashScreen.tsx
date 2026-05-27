"use client";

import { useState, useEffect } from "react";
import { GlobalOverlayLoading } from "./loaders";

export default function InitialSplashScreen({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Khi chưa mount xong (CSS chưa nạp), hiện loader nền đặc chặn FOUC hoàn toàn
  if (!isMounted) {
    return <GlobalOverlayLoading isSolid={true} />;
  }

  return <>{children}</>;
}