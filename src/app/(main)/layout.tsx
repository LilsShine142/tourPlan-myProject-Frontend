"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import AppHeader from "./components/AppHeader"; // Import Header của App

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Kiểm tra xem có đang ở trang chi tiết chuyến đi không.
  const isTripDetail = pathname?.includes("/trips/") && pathname !== "/trips";
  
  // Kiểm tra xem có đang ở trang chi tiết nhóm không (VD: /groups/123)
  const isGroupDetail = pathname?.includes("/groups/") && pathname !== "/groups";
  
  // Gom điều kiện: Ẩn thanh Nav tổng trên Mobile nếu đang ở bất kỳ trang chi tiết nào
  const hideNavOnMobile = isTripDetail || isGroupDetail;

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50/50">
      
      {/* ── APP HEADER: Hiển thị thanh công cụ & user ở trên cùng ── */}
      <AppHeader />

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-24 scroll-smooth">
        <div className="w-full h-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* ── BOTTOM NAVIGATION ── 
        - Ẩn trên mobile (max-md:hidden) nếu đang ở trang Detail (isTripDetail / isGroupDetail) 
        - Luôn hiện trên Desktop (md:block)
      */}
      <nav
        className={`fixed bottom-0 left-0 w-full z-50
          ${hideNavOnMobile ? "hidden md:block" : "block"}
        `}
      >
        <div className="w-full bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <NavigationBar /> 
        </div>
      </nav>
      
    </div>
  );
}