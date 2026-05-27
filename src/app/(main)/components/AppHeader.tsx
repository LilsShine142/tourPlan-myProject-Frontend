"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, Dropdown, Button, Badge, Input } from "antd";
import { 
  CompassOutlined, 
  BellOutlined, 
  PlusOutlined,
  HomeOutlined,
  GlobalOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import type { MenuProps } from 'antd';

export default function AppHeader() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth >= 768); 
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const userMenu: MenuProps['items'] = [
    { 
      key: 'user-info', 
      label: (
        <div className="px-2 py-1.5 min-w-[160px]">
          <p className="font-bold text-gray-800 text-sm m-0">Nguyễn Văn A</p>
          <p className="text-[11px] text-gray-400 m-0 truncate">nguyenvana@example.com</p>
        </div>
      ),
      disabled: true
    },
    { type: 'divider' },
    { key: 'profile', label: <Link href="/profile"><UserOutlined className="mr-2"/>Hồ sơ cá nhân</Link> },
    { key: 'settings', label: <Link href="/settings"><SettingOutlined className="mr-2" />Cài đặt tài khoản</Link> },
    { type: 'divider' },
    { key: 'marketing-home', label: <Link href="/">Về trang chủ giới thiệu</Link> },
    { type: 'divider' },
    { key: 'logout', label: <span className="text-red-500 font-medium"><LogoutOutlined className="mr-2"/>Đăng xuất</span> },
  ];

  const isActive = (path: string) => pathname === path ? "text-teal-600 bg-teal-50/60" : "text-gray-500 hover:text-teal-600 hover:bg-transparent sm:hover:bg-gray-50";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm w-full">
      {/* Đổi px-4 thành px-2 trên mobile để nhích toàn bộ nội dung ra sát lề hơn */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* ── KHỐI TRÁI: LOGO ── */}
        <div className="flex items-center shrink-0 ml-1 sm:ml-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <CompassOutlined className="text-xl text-teal-600" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
              TripPlanner<span className="text-teal-600">.</span>
            </span>
          </Link>
        </div>

        {/* ── KHỐI GIỮA: CHỈ HIỂN THỊ TRÊN DESKTOP/LAPTOP ── */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-2 px-6 max-w-3xl">
          <Link 
            href="/main" 
            className={`flex items-center justify-center lg:w-auto lg:h-auto lg:px-3.5 lg:py-2 rounded-xl text-sm font-bold transition-all duration-200 shrink-0 ${isActive('/main')}`}
          >
            <HomeOutlined className="text-lg lg:text-base" />
            <span className="hidden lg:inline lg:ml-1.5">Trang chủ</span>
          </Link>

          <div className="flex-1 w-full min-w-[200px] mx-2">
            <Input 
              placeholder="Tìm kiếm chuyến đi, bạn bè, địa điểm..." 
              prefix={<SearchOutlined className="text-gray-400 mr-1" />} 
              className="rounded-xl bg-gray-50 border-gray-100 hover:border-gray-200 focus:border-teal-500 focus:bg-white h-10 text-sm font-medium transition-all w-full"
            />
          </div>

          <Link 
            href="/explore" 
            className={`flex items-center justify-center lg:w-auto lg:h-auto lg:px-3.5 lg:py-2 rounded-xl text-sm font-bold transition-all duration-200 shrink-0 ${isActive('/explore')}`}
          >
            <GlobalOutlined className="text-lg lg:text-base" />
            <span className="hidden lg:inline lg:ml-1.5">Khám phá</span>
          </Link>
        </nav>

        {/* ── KHỐI PHẢI: UTILITIES & USER ── */}
        {/* Thu hẹp gap xuống 0.5 (2px) trên mobile, và gap-3 (12px) trên desktop */}
        <div className="flex items-center gap-0.5 sm:gap-3 shrink-0 justify-end mr-1 sm:mr-0">
          
          <Link 
            href="/" 
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${isActive('/main')}`}
          >
            <HomeOutlined className="text-[22px]" />
          </Link>

          <Link 
            href="/explore" 
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${isActive('/explore')}`}
          >
            <GlobalOutlined className="text-[22px]" />
          </Link>

          {isDesktop && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              className="bg-teal-600 hover:bg-teal-500 rounded-xl font-bold h-10 shadow-sm border-0 px-4 transition-all"
            >
              Tạo chuyến đi
            </Button>
          )}
          
          {/* Chỉnh nhẹ lại badge offset cho phù hợp với icon nhỏ hơn trên mobile */}
          <Badge count={5} size="small" offset={[-2, 4]} className="cursor-pointer ml-1 sm:ml-0">
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 flex items-center justify-center text-gray-600 transition-all">
              <BellOutlined className="text-[22px] sm:text-xl" />
            </button>
          </Badge>

          <div className="w-[1px] h-6 bg-gray-200 mx-1 hidden md:block"></div>

          <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']} arrow>
            <div className="flex items-center rounded-lg sm:rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group ml-1 sm:ml-0">
              {/* Dùng size 36 (hoặc mặc định của antd) trên mobile cho gọn, size 40 trên desktop */}
              <Avatar 
                size={isDesktop ? 40 : 36} 
                src="https://i.pravatar.cc/150?u=traveler1" 
                className="border border-gray-100 group-hover:border-teal-500 transition-colors"
              />
            </div>
          </Dropdown>
          
        </div>
      </div>
    </header>
  );
}