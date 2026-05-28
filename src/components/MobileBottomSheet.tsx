"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Tiêu đề hiển thị trên header của sheet */
  title: string;
  /** Phụ đề nhỏ bên dưới tiêu đề (tuỳ chọn) */
  subtitle?: string;
  children: React.ReactNode;
  /** % chiều cao mặc định khi mở (default: 70) */
  defaultVh?: number;
  /** % chiều cao tối đa khi kéo lên (default: 90) */
  maxVh?: number;
}

export default function MobileBottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  defaultVh = 70,
  maxVh = 90,
}: MobileBottomSheetProps) {
  const [currentH, setCurrentH] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [visible, setVisible] = useState(false);

  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const startTimeRef = useRef(0);
  const lastDyRef = useRef(0);
  const currentHRef = useRef(0); // luôn sync với currentH, dùng trong callbacks
  // Dùng để quản lý timeout đóng sheet
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const getMaxH = () => (window.innerHeight * maxVh) / 100;
  const getDefaultH = () => (window.innerHeight * defaultVh) / 100;

  // Mở / đóng
  useEffect(() => {
    // Xóa timeout đóng cũ nếu có để tránh xung đột khi click nhanh
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (open) {
      setVisible(true);
      
      // Delay nhẹ để đảm bảo DOM đã render trước khi chạy animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const h = getDefaultH();
          setCurrentH(h);
          currentHRef.current = h;
        });
      });
    } else {
      setCurrentH(0);
      currentHRef.current = 0;
      
      // Gán timeout vào ref để có thể clear
      closeTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        closeTimeoutRef.current = null;
      }, 440); // 440ms phải match với thời gian transition
    }

    // Cleanup function khi component unmount
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [open, defaultVh]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startHRef.current = currentHRef.current;
    startTimeRef.current = Date.now();
    lastDyRef.current = 0;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const dy = e.touches[0].clientY - startYRef.current;
      lastDyRef.current = dy;
      let newH = startHRef.current - dy; // kéo lên → dy âm → newH tăng
      const max = getMaxH();

      if (newH > max) newH = max + (newH - max) * 0.12; // rubber-band
      newH = Math.max(0, newH);

      setCurrentH(newH);
      currentHRef.current = newH;
    },
    [maxVh]
  );

  const handleTouchEnd = useCallback(() => {
    const h = currentHRef.current;
    const dy = lastDyRef.current;
    const vel = dy / (Date.now() - startTimeRef.current); // px/ms
    setIsDragging(false);

    if (vel > 0.5 || h < getDefaultH() * 0.35) {
      // Dismiss
      setCurrentH(0);
      currentHRef.current = 0;
      setTimeout(onClose, 440);
    } else if (h > getMaxH() * 0.9) {
      const max = getMaxH();
      setCurrentH(max);
      currentHRef.current = max;
    } else {
      const def = getDefaultH();
      setCurrentH(def);
      currentHRef.current = def;
    }
  }, [onClose, maxVh, defaultVh]);

  const dismiss = useCallback(() => {
    setCurrentH(0);
    currentHRef.current = 0;
    // Gọi onClose để báo cho component cha biết cần đóng
    // Component cha sẽ đổi prop `open` thành false, từ đó trigger useEffect phía trên
    onClose();
  }, [onClose]);

  if (!visible) return null;

  const backdropOpacity = Math.min(1, currentH / (getDefaultH() || 1)) * 0.55;

  return (
    <>
      {/* Backdrop — chỉ hiện trên mobile */}
      <div
        className="md:hidden fixed inset-0 z-[60]"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: backdropOpacity,
          transition: isDragging ? "none" : "opacity 0.42s ease",
          pointerEvents: currentH > 20 ? "auto" : "none",
        }}
        onClick={dismiss}
      />

      {/* Sheet */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[61] bg-white flex flex-col will-change-[height]"
        style={{
          height: currentH,
          borderRadius: "28px 28px 0 0",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.14)",
          overflow: "hidden",
          transition: isDragging
            ? "none"
            : "height 0.42s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* ── Drag zone: pill + header ── */}
        <div
          className="flex-shrink-0 bg-white select-none touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Home-indicator pill */}
          <div className="flex justify-center pt-[14px] pb-[10px]">
            <div
              style={{
                width: 36,
                height: 5,
                borderRadius: 99,
                backgroundColor: "#D1D5DB",
              }}
            />
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between px-5 pb-4">
            <div>
              <h2 className="font-black text-[19px] text-gray-900 tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={dismiss}
              className="w-9 h-9 rounded-full bg-gray-100 active:bg-gray-200 flex items-center justify-center text-gray-500 text-[13px] font-bold transition-colors"
            >
              ✕
            </button>
          </div>
          {/* Divider */}
          <div className="h-px bg-gray-100" />
        </div>

        {/* ── Scrollable content ── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain bg-[#F6F8FA]"
          onTouchStart={(e) => e.stopPropagation()}
        >
          {children}
          <div style={{ height: "env(safe-area-inset-bottom, 20px)" }} />
        </div>
      </div>
    </>
  );
}
