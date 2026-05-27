"use client";

import { useState, useRef } from "react";
import { Button, Tag, Avatar, Empty, Dropdown, MenuProps, Drawer } from "antd";
import { 
  PlusOutlined, 
  ArrowRightOutlined, 
  EnvironmentOutlined,
  CalendarOutlined,
  CameraOutlined,
  DeleteOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { MOCK_TRIPS } from "@/lib/mockData";
import { APP_ROUTES } from "@/config/routes";
import { CreateTripModal } from "@/components/modals/CreateTripModal";

// --- DỮ LIỆU DỰ PHÒNG CHỐNG CRASH ---
// (Nếu MOCK_TRIPS của bạn bị rỗng hoặc lỗi, code sẽ tự động dùng dữ liệu này để đảm bảo UI vẫn render)
const FALLBACK_TRIPS: any[] = [
  {
    id: "trip-1",
    name: "Đà Lạt Mộng Mơ",
    currency: "VND",
    coverImageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop",
    locationCount: 5,
    dayCount: 3,
    members: [
      { userId: "u1", displayName: "Tuấn", avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" },
      { userId: "u2", displayName: "Linh", avatarUrl: "" }
    ]
  },
  {
    id: "trip-2",
    name: "Vũng Tàu Cuối Tuần",
    currency: "VND",
    coverImageUrl: null,
    locationCount: 2,
    dayCount: 2,
    members: [
      { userId: "u3", displayName: "Hải", avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" }
    ]
  }
];

// --- COMPONENT TRIP CARD ---
const TripCard = ({ trip, onClick }: { trip: any; onClick: () => void }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(trip?.coverImageUrl || null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  // --- LOGIC: NHẤN GIỮ ---
  const handleTouchStart = () => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
      setIsMobileMenuOpen(true);
    }, 500); 
  };

  const handleTouchEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
  const handleTouchMove = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPress.current = false;
      return;
    }
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverUrl(imageUrl);
      e.target.value = '';
    }
    setIsMobileMenuOpen(false); 
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'change',
      icon: <CameraOutlined />,
      label: 'Đổi ảnh bìa',
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        domEvent.preventDefault();
        fileInputRef.current?.click();
      }
    },
    ...(coverUrl ? [{
      key: 'remove',
      icon: <DeleteOutlined />,
      danger: true,
      label: 'Xóa ảnh bìa',
      onClick: ({ domEvent }: any) => {
        domEvent.stopPropagation();
        domEvent.preventDefault();
        setCoverUrl(null);
      }
    }] : [])
  ];

  // Logic đảm bảo an toàn truy xuất members
  const safeMembers = Array.isArray(trip?.members) ? trip.members : [];

  // --- UI: NỘI DUNG THẺ ---
  const CardContent = () => {
    if (coverUrl) {
      return (
        <div className="group relative w-full h-[220px] md:h-[280px] rounded-4xl md:rounded-[32px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500 active:scale-[0.98]">
          <img 
            src={coverUrl} 
            alt={trip?.name || "Chuyến đi"} 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" 
            draggable={false} 
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/20 to-black/90 pointer-events-none transition-opacity duration-500 group-hover:opacity-90" />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-5 px-5 text-white pointer-events-none select-none">
            <h3 className="text-2xl md:text-3xl font-black mb-2 z-10 text-center tracking-tight drop-shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
              {(trip?.name || "Chuyến đi").toUpperCase()}
            </h3>
            
            <div className="flex items-center gap-2 z-10 text-sm font-medium mb-auto drop-shadow-md opacity-90 transition-transform duration-300 group-hover:-translate-y-1">
              <span>{trip?.currency || "VND"}</span>
              <span>•</span>
              <Avatar.Group size={24} max={{ count: 3 }}>
                {safeMembers.map((m: any, idx: number) => (
                  <Avatar key={m?.userId || idx} src={m?.avatarUrl} className="border-white/50 text-xs bg-teal-500">
                    {!m?.avatarUrl && (m?.displayName?.[0]?.toUpperCase() || "U")}
                  </Avatar>
                ))}
              </Avatar.Group>
              <span>•</span>
              <span>{safeMembers.length} người</span>
            </div>

            <div className="flex items-center gap-2 z-10 w-full justify-center mt-auto flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] md:text-xs font-medium border border-white/20 hover:bg-white/30 transition-colors">
                <EnvironmentOutlined /> {trip?.locationCount || 0} điểm
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] md:text-xs font-medium border border-white/20 hover:bg-white/30 transition-colors">
                <CalendarOutlined /> {trip?.dayCount || 0} ngày
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] md:text-xs font-medium border border-white/20 hover:bg-white/30 transition-colors hidden md:flex">
                <ClockCircleOutlined /> 1 ngày trước
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group bg-white rounded-4xl md:rounded-[32px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-xl hover:shadow-teal-900/5 hover:border-teal-200 active:scale-[0.98] transition-all duration-300 flex items-center md:flex-col md:items-start gap-4 md:gap-6 relative md:h-[280px]">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-[20px] bg-teal-50 flex items-center justify-center text-teal-600 text-2xl md:text-3xl shrink-0 select-none pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          ✈️
        </div>
        
        <div className="flex-1 min-w-0 pointer-events-none select-none md:w-full md:flex md:flex-col md:flex-1">
          <h3 className="font-bold text-gray-900 truncate text-lg md:text-2xl select-none group-hover:text-teal-700 transition-colors">{trip?.name || "Chuyến đi"}</h3>
          <div className="flex items-center gap-2 mt-1.5 md:mt-3 flex-wrap">
            <Tag className="rounded-full text-[10px] md:text-xs m-0 border-0 bg-gray-100 text-gray-500 font-medium select-none">
              {trip?.currency || "VND"}
            </Tag>
            <Avatar.Group size={24} max={{ count: 3 }}>
              {safeMembers.map((m: any, idx: number) => (
                <Avatar key={m?.userId || idx} src={m?.avatarUrl} className="bg-teal-400 text-white text-[10px] border-white select-none">
                  {!m?.avatarUrl && (m?.displayName?.[0]?.toUpperCase() || "U")}
                </Avatar>
              ))}
            </Avatar.Group>
            <span className="text-xs text-gray-400 font-medium select-none">{safeMembers.length} người</span>
          </div>
          
          <div className="hidden md:flex flex-col mt-auto w-full gap-2">
            <div className="h-px w-full bg-gray-100 mb-2"></div>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                <Tag color="cyan" className="rounded-full text-xs font-medium border-0 bg-teal-50 text-teal-600 select-none m-0">
                  <EnvironmentOutlined className="mr-1" />{trip?.locationCount || 0} điểm
                </Tag>
              </div>
              <span className="text-xs text-gray-400 font-medium select-none">{trip?.dayCount || 0} ngày</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 pointer-events-none select-none md:hidden">
          <Tag color="cyan" className="rounded-full text-[10px] font-medium block mb-1.5 border-0 bg-teal-50 text-teal-600 select-none">
            <EnvironmentOutlined className="mr-1" />{trip?.locationCount || 0} điểm
          </Tag>
          <span className="text-xs text-gray-400 font-medium select-none">{trip?.dayCount || 0} ngày</span>
        </div>
        
        <div className="absolute right-5 bottom-6 hidden md:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
          <ArrowRightOutlined className="pointer-events-none select-none group-hover:-rotate-45 transition-transform duration-300" />
        </div>
        <ArrowRightOutlined className="text-gray-300 ml-1 pointer-events-none select-none md:hidden" />
      </div>
    );
  };

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        <div
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onContextMenu={handleContextMenu}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', touchAction: 'pan-y' }} 
          className="relative outline-none cursor-pointer select-none h-full"
        >
          <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} onClick={(e) => e.stopPropagation()} />
          <CardContent />
        </div>
      </Dropdown>

      <Drawer
        placement="bottom"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        classNames={{ body: "p-2", header: "border-b-0 pb-0" }}
        size="default"
        className="md:hidden rounded-t-4xl"
        title={<div className="text-center text-gray-400 w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />} 
        closeIcon={false}
      >
        <div className="flex flex-col gap-1 mt-4">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 px-4 py-4 w-full text-left bg-white active:bg-teal-50 rounded-2xl transition-colors text-gray-800 font-medium text-base">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><CameraOutlined className="text-lg" /></div>
            {coverUrl ? "Đổi ảnh bìa khác" : "Thêm ảnh bìa"}
          </button>
          {coverUrl && (
            <button onClick={() => { setCoverUrl(null); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 px-4 py-4 w-full text-left bg-white active:bg-red-50 rounded-2xl transition-colors text-red-600 font-medium text-base">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><DeleteOutlined className="text-lg" /></div>Xóa ảnh bìa
            </button>
          )}
        </div>
      </Drawer>
    </>
  );
};

// --- TRANG CHÍNH ---
export default function TripsPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  
  // TỰ ĐỘNG CHUYỂN ĐỔI: Nếu MOCK_TRIPS bị lỗi/rỗng, tự fallback về FALLBACK_TRIPS
  const tripsData = Array.isArray(MOCK_TRIPS) && MOCK_TRIPS.length > 0 ? MOCK_TRIPS : FALLBACK_TRIPS;

  return (
    <div className="max-w-2xl md:max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-12">
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <div>
          <h1 className="text-[28px] md:text-4xl font-black text-gray-900 tracking-tight">Lịch trình</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2 font-medium">{tripsData.length} hành trình đang chờ bạn</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="rounded-2xl font-bold hidden md:flex bg-teal-600 hover:bg-teal-500 shadow-sm hover:shadow-teal-600/30 border-0 h-12 px-6 transition-all"
        >
          Tạo chuyến đi
        </Button>
      </div>

      {tripsData.length === 0 ? (
        <Empty description="Chưa có hành trình nào" className="py-16 md:py-32" />
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 mb-6 md:mb-12">
          {tripsData.map((t: any) => (
            <TripCard 
              key={t.id} 
              trip={t} 
              // Thêm fallback an toàn tránh lỗi route khi id rỗng
              onClick={() => router.push(APP_ROUTES.MAIN.TRIP_DETAIL(t.id || 'default-id'))} 
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 mb-24 md:mb-10">
        <span className="px-4 py-2 bg-gray-100/80 rounded-full text-[11px] md:text-sm text-gray-500 font-medium shadow-sm transition-all hover:bg-gray-200 cursor-default">
          <span className="md:hidden">👆 Nhấn giữ hành trình để đổi ảnh bìa</span>
          <span className="hidden md:inline">🖱️ Chuột phải vào hành trình bất kỳ để quản lý ảnh bìa</span>
        </span>
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 md:hidden"
      >
        <PlusOutlined className="text-2xl" />
      </button>

      <CreateTripModal open={showCreate} onClose={() => setShowCreate(false)} onSave={() => {}} />
    </div>
  );
}

