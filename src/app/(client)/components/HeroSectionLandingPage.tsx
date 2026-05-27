"use client";
import Link from "next/link";
import { Button } from "antd";
import { 
  RocketOutlined, 
  EnvironmentOutlined, 
  RightOutlined,
  LeftOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";

// Mảng fake data chứa các đường dẫn ảnh giao diện (Mockup)
const MOCKUP_IMAGES = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop", // Du lịch đường bộ
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", // Phong cảnh núi
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop", // Cắm trại
  "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop"  // Vali du lịch
];

export default function HeroSectionLandingPage() {    
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOCKUP_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % MOCKUP_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + MOCKUP_IMAGES.length) % MOCKUP_IMAGES.length);
  };
  
    return (
<section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-medium text-sm">
          🎉 Trải nghiệm phiên bản Web Tour Plan 2.0 nhé!
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-[1.1]">
          Lên kế hoạch cho <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-500 to-emerald-400">
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
        
        {/* Slider Hình ảnh minh họa */}
      <div className="mt-16 w-full max-w-5xl rounded-3xl bg-white p-2 shadow-2xl border border-gray-100/50 aspect-video relative group">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-100">
          
          {/* Các ảnh trong Slider */}
          {MOCKUP_IMAGES.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Giao diện ứng dụng ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}

          {/* Nút lùi (Prev) */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md cursor-pointer"
          >
            <LeftOutlined />
          </button>

          {/* Nút tiến (Next) */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/70 backdrop-blur text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-md cursor-pointer"
          >
            <RightOutlined />
          </button>

          {/* Dấu chấm chỉ báo (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {MOCKUP_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? "w-6 h-2 bg-white" 
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Chuyển đến ảnh ${index + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
    )
}