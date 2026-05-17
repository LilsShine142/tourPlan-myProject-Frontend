// Đường dẫn: components/ui/loaders.tsx
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Loading xoay tròn cơ bản (Dùng cho TripDetail)
export function SpinnerLoading({ text = "Đang tải dữ liệu..." }: { text?: string }) {
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center space-y-3 transition-opacity duration-300">
      <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      <p className="text-gray-500 font-medium animate-pulse">{text}</p>
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
export function GlobalOverlayLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-t-teal-500 border-gray-200 animate-spin" />
    </div>
  );
}