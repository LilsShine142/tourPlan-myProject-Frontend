"use client";

import { usePathname } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";

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
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full pb-20 md:pb-24 scroll-smooth">
        <div className="max-w-7xl mx-auto w-full h-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Bottom Navigation 
        - Ẩn trên mobile (max-md:hidden) nếu đang ở trang Trip Detail (isTripDetail) 
        - Luôn hiện trên Desktop (md:block)
      */}
      <nav
        className={`fixed bottom-0 left-0 w-full z-50
          ${hideNavOnMobile ? "hidden md:block" : "block"}
        `}
      >
        {/* Đã xóa max-w-md để thẻ div này kéo dài full 100% width */}
        <div className="w-full bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <NavigationBar /> 
        </div>
      </nav>
      
    </div>
  );
}