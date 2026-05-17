import Link from "next/link";
import { Button } from "antd";
import { 
  RocketOutlined, 
  EnvironmentOutlined 
} from "@ant-design/icons";

export default function HeroSectionLandingPage() {    
    return (
<section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-medium text-sm">
          🎉 Phiên bản Web Tour Plan 2.0 đã ra mắt!
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-[1.1]">
          Lên kế hoạch cho <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">
            chuyến đi trong mơ
          </span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl">
          Nói lời tạm biệt với những file Excel rườm rà. Lên lịch trình, quản lý chi phí và đồng hành cùng bạn bè trên một nền tảng duy nhất, mượt mà và trực quan.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              type="primary" 
              size="large" 
              icon={<RocketOutlined />}
              className="w-full h-14 px-8 text-lg rounded-2xl font-semibold bg-teal-600 hover:bg-teal-500 border-0 shadow-lg shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              Lên lịch trình ngay
            </Button>
          </Link>
          <Link href="/explore" className="w-full sm:w-auto">
            <Button 
              size="large" 
              className="w-full h-14 px-8 text-lg rounded-2xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-teal-600 hover:text-teal-600 hover:-translate-y-1 transition-all duration-300"
            >
              Xem mẫu có sẵn
            </Button>
          </Link>
        </div>
        
        {/* Mockup Hình ảnh minh họa (Thẻ div thay thế) */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl bg-white p-2 shadow-2xl border border-gray-100/50 aspect-video relative overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-50"></div>
          {/* Chỗ này sau này bạn chèn thẻ <Image /> chụp giao diện App của bạn nhé */}
          <span className="relative z-10 text-gray-400 font-medium text-lg flex flex-col items-center gap-3">
            <EnvironmentOutlined className="text-4xl text-gray-300 group-hover:scale-110 transition-transform" />
            Hình ảnh giao diện ứng dụng của bạn
          </span>
        </div>
        </section>
    )
}