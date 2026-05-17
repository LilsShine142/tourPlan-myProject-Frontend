'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Map, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/config/routes';

export default function NavigationBar() {
  const pathname = usePathname();

  // Danh sách các tab dựa trên thiết kế UI của bạn
  const navItems = [
    { name: 'Nhóm', icon: Users, path: APP_ROUTES.MAIN.DASHBOARD || '/' },
    { name: 'Lịch trình', icon: Map, path: APP_ROUTES.MAIN.TRIPS || '/trips' },
    { name: 'Lịch', icon: Calendar, path: APP_ROUTES.MAIN.CALENDAR || '/calendar' },
    { name: 'Cá nhân', icon: User, path: APP_ROUTES.PROFILE.INDEX || '/profile' },
  ];

  // Hàm kiểm tra tab đang active
  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname?.startsWith(path);
  };

  return (
    // Background full width với chiều cao linh hoạt cho mobile/desktop
    <div className="w-full bg-white h-16 md:h-20 pb-safe flex justify-center">
      {/* Container giới hạn độ rộng cho các nút bấm để trên màn hình to không bị tản ra quá xa */}
      <div className="flex justify-around items-center w-full max-w-2xl h-full px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 group"
            >
              <div
                className={cn(
                  "p-1.5 md:p-2 rounded-full transition-all duration-300",
                  active ? "bg-teal-50" : "bg-transparent group-hover:bg-gray-50"
                )}
              >
                <Icon 
                  size={24} 
                  className={cn(active ? "text-teal-600" : "text-gray-400 group-hover:text-gray-600")} 
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium transition-colors",
                  active ? "text-teal-600" : "text-gray-500 group-hover:text-gray-700"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}