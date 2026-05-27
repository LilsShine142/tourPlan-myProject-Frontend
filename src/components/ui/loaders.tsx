import { Spin } from "antd";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Loading xoay tròn cơ bản (Dùng bên trong các component con)
export function SpinnerLoading() {
  return (
    <div className="w-full py-12 flex items-center justify-center transition-opacity duration-300">
      <Spin size="large" />
    </div>
  );
}

// 2. Loading kiểu Skeleton (Dùng cho lúc load Danh sách, Table)
export function ListSkeletonLoading() {
  return (
    <div className="flex flex-col space-y-4 w-full p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-[120px] w-full rounded-xl" />
      <Skeleton className="h-[120px] w-full rounded-xl" />
    </div>
  );
}

// 3. Loading Global (Phủ toàn màn hình khi submit form/chuyển trang nặng)
// Sử dụng Spin của antd và điều chỉnh mảng màu nền thông qua prop isSolid
export function GlobalOverlayLoading({ isSolid = false }: { isSolid?: boolean }) {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isSolid 
          ? "bg-[#F8F9FA]" // Nền màu xám nhạt (đặc) che FOUC lúc mới vào trang
          : "bg-white/70 backdrop-blur-md" // Nền mờ (kính) sang trọng khi đang submit thao tác
      }`}
    >
      <Spin size="large" />
    </div>
  );
}