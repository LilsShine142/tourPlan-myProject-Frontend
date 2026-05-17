import Link from "next/link";
import { Button } from "antd";
import { CompassOutlined } from "@ant-design/icons";

export default function ClientHeader() {    
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <CompassOutlined className="text-xl text-teal-600" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">TripPlanner<span className="text-teal-600">.</span></span>
          </Link>

          {/* Navigation - Ẩn trên Mobile, hiện trên Desktop */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-500">
            <Link href="/" className="hover:text-teal-600 transition-colors">Trang chủ</Link>
            <Link href="/explore" className="hover:text-teal-600 transition-colors">Khám phá</Link>
            <Link href="/about" className="hover:text-teal-600 transition-colors">Về chúng tôi</Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-gray-600 hover:text-teal-600 font-medium px-4">
              Đăng nhập
            </Link>
            <Link href="/register">
              <Button type="primary" size="large" className="rounded-xl font-semibold bg-teal-600 hover:bg-teal-500 border-0 shadow-sm">
                Bắt đầu miễn phí
              </Button>
            </Link>
          </div>
        </div>
        </header>
    )
}