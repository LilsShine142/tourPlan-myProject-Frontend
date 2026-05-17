"use client";

import { useState } from "react";
import { 
  CalendarOutlined,
  PushpinOutlined,
  HeartFilled,
  VerifiedOutlined,
} from "@ant-design/icons";
import HeaderFilterExplorePage from "@/app/(client)/components/HeaderFilterExplorePage";
import ExploreFooter from "@/app/(client)/components/ExploreFooter";

// ============================================================
// MOCK DATA: Bảng tin (Giữ nguyên như bản trước)
// ============================================================
const MOCK_FEEDS = [
  {
    feedId: "feed-001",
    likes: 1245,
    publisherType: "business",
    price: 2500000,
    isSponsored: true,
    trip: {
      id: "trip-dalat-01",
      name: "Đà Lạt Chữa Lành - Mùa Săn Mây (Trọn gói)",
      coverImageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
      status: "ongoing",
      startDate: "2026-05-10",
      endDate: "2026-05-12",
      members: [{ avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=DalatTravel", displayName: "Dalat Tourist" }],
      dayCount: 3,
      locationCount: 15,
    }
  },
  {
    feedId: "feed-002",
    likes: 342,
    publisherType: "user",
    trip: {
      id: "trip-hagiang-02",
      name: "Phượt Xe Máy Mộc Châu - Hà Giang cực cháy",
      coverImageUrl: "https://images.unsplash.com/photo-1541893356-9a2cf11f6c40?w=800&q=80",
      status: "completed",
      startDate: "2026-04-20",
      endDate: "2026-04-24",
      members: [
        { avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Phuot", displayName: "Hùng Phượt" },
        { displayName: "Tiến Đạt" }
      ],
      dayCount: 5,
      locationCount: 22,
    }
  },
  {
    feedId: "feed-003",
    likes: 890,
    publisherType: "business",
    price: 6500000,
    isSponsored: false,
    trip: {
      id: "trip-phuquoc-03",
      name: "Nghỉ Dưỡng Resort 5 Sao Phú Quốc",
      coverImageUrl: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
      status: "planning",
      startDate: "2026-06-10",
      endDate: "2026-06-13",
      members: [{ avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Vinpearl", displayName: "Vinpearl Resort" }],
      dayCount: 4,
      locationCount: 8,
    }
  },
  {
    feedId: "feed-004",
    likes: 210,
    publisherType: "user",
    price: 1500000,
    trip: {
      id: "trip-hue-04",
      name: "Food Tour Huế - Đà Nẵng ngon bổ rẻ",
      coverImageUrl: "https://images.unsplash.com/photo-1610416973618-8fb3593ec2a8?w=800&q=80",
      status: "completed",
      startDate: "2026-03-15",
      endDate: "2026-03-17",
      members: [
        { avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Foodie", displayName: "Hà Trang" },
        { displayName: "Lê Na" }
      ],
      dayCount: 3,
      locationCount: 18,
    }
  }
];

const CATEGORIES = ["Tất cả", "Doanh nghiệp", "Cộng đồng chia sẻ", "Biển đảo", "Núi rừng", "Food Tour"];

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}`;
};

export default function ExplorePage() {
  // State để đóng/mở khu vực bộ lọc nâng cao
  const [showFilters, setShowFilters] = useState(false);
  // State lưu khoảng giá trị của Slider (Ví dụ: 0 - 10 triệu)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* HEADER & FILTER SECTION */}
      <HeaderFilterExplorePage 
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        CATEGORIES={CATEGORIES}
      />

      {/* FEED LƯỚI BÀI ĐĂNG (Giữ nguyên giao diện xịn xò) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_FEEDS.map((feed) => (
             /* Code render Card giữ nguyên y hệt bản trước */
            <div 
              key={feed.feedId}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* ẢNH BÌA & OVERLAYS */}
              <div className="h-52 w-full relative overflow-hidden bg-gray-200">
                <img 
                  src={feed.trip.coverImageUrl} 
                  alt={feed.trip.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                
                {/* Lượt Likes ở góc trên bên phải */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1.5 hover:bg-rose-50 transition-colors">
                  <HeartFilled className="text-rose-500 text-sm" /> 
                  <span>{feed.likes.toLocaleString('vi-VN')}</span>
                </div>

                {/* Tag "Tài trợ" hoặc "Doanh nghiệp" góc trái */}
                {feed.publisherType === 'business' && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <VerifiedOutlined /> {feed.isSponsored ? "Tài trợ" : "Đối tác"}
                    </span>
                  </div>
                )}

                {/* Info ghim ở đáy ảnh */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <PushpinOutlined className="text-teal-400" /> 
                    <span>{feed.trip.locationCount} địa điểm</span>
                  </div>
                </div>
              </div>

              {/* NỘI DUNG THẺ */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <span className="text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                    {feed.trip.dayCount} Ngày
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarOutlined /> {formatDate(feed.trip.startDate)} - {formatDate(feed.trip.endDate)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 line-clamp-2 mb-4 group-hover:text-teal-600 transition-colors">
                  {feed.trip.name}
                </h3>

                {/* FOOTER CỦA CARD */}
                <ExploreFooter feed={feed} />

              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}