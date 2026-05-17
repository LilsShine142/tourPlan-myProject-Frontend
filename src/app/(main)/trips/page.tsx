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
import { TripWithStats } from "@/models";
import { APP_ROUTES } from "@/config/routes";
import { CreateTripModal } from "@/components/modals/CreateTripModal";

// --- COMPONENT TRIP CARD ---
const TripCard = ({ trip, onClick }: { trip: TripWithStats; onClick: () => void }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(trip.coverImageUrl || null);
  
  // State quản lý Menu Bottom Sheet trên Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  // --- LOGIC: NHẤN GIỮ (LONG PRESS) CHO MOBILE ---
  const handleTouchStart = () => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      
      // Rung nhẹ điện thoại để phản hồi (chỉ hoạt động trên Android)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      setIsMobileMenuOpen(true);
    }, 500); 
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleTouchMove = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPress.current = false;
      return;
    }
    onClick();
  };

  // Ngăn menu mặc định của trình duyệt mobile
  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // --- LOGIC: CHỌN ẢNH BÌA ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverUrl(imageUrl);
      e.target.value = '';
    }
    setIsMobileMenuOpen(false); 
  };

  // --- LOGIC: MENU CHO DESKTOP (CHUỘT PHẢI) ---
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

  // --- UI: NỘI DUNG THẺ ---
  const CardContent = () => {
    if (coverUrl) {
      return (
        <div className="relative w-full h-55 rounded-4xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98]">
          <img src={coverUrl} alt={trip.name} className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" draggable={false} />
          
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/80 pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-4 px-4 text-white pointer-events-none select-none">
            <h3 className="text-2xl font-black mb-1 z-10 text-center tracking-tight drop-shadow-md">
              {trip.name.toUpperCase()}
            </h3>
            
            <div className="flex items-center gap-2 z-10 text-sm font-medium mb-auto drop-shadow-md opacity-90">
              <span>{trip.currency}</span>
              <span>•</span>
              <Avatar.Group size={20} max={{ count: 3 }}>
                {trip.members.map((m) => (
                  <Avatar key={m.userId} src={m.avatarUrl} className="border-white/50 text-[10px]">
                    {!m.avatarUrl && m.displayName[0].toUpperCase()}
                  </Avatar>
                ))}
              </Avatar.Group>
              <span>•</span>
              <span>{trip.members.length} người</span>
            </div>

            <div className="flex items-center gap-2 z-10 w-full justify-center mt-auto">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-medium border border-white/20">
                <EnvironmentOutlined /> {trip.locationCount} địa điểm
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-medium border border-white/20">
                <CalendarOutlined /> {trip.dayCount} ngày
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-medium border border-white/20">
                <ClockCircleOutlined /> 1 ngày trước
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-4xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-md hover:border-teal-200 active:scale-[0.98] transition-all duration-300 flex items-center gap-4 relative">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 text-2xl shrink-0 select-none pointer-events-none">
          ✈️
        </div>
        <div className="flex-1 min-w-0 pointer-events-none select-none">
          <h3 className="font-bold text-gray-900 truncate text-lg select-none">{trip.name}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Tag className="rounded-full text-[10px] m-0 border-0 bg-gray-100 text-gray-500 font-medium select-none">
              {trip.currency}
            </Tag>
            <Avatar.Group size={20} max={{ count: 3 }}>
              {trip.members.map((m) => (
                <Avatar key={m.userId} src={m.avatarUrl} size={20} className="bg-teal-400 text-white text-[10px] border-white select-none">
                  {!m.avatarUrl && m.displayName[0].toUpperCase()}
                </Avatar>
              ))}
            </Avatar.Group>
            <span className="text-xs text-gray-400 font-medium select-none">{trip.members.length} người</span>
          </div>
        </div>
        <div className="text-right shrink-0 pointer-events-none select-none">
          <Tag color="cyan" className="rounded-full text-[10px] font-medium block mb-1.5 border-0 bg-teal-50 text-teal-600 select-none">
            <EnvironmentOutlined className="mr-1" />{trip.locationCount} điểm
          </Tag>
          <span className="text-xs text-gray-400 font-medium select-none">{trip.dayCount} ngày</span>
        </div>
        <ArrowRightOutlined className="text-gray-300 ml-1 pointer-events-none select-none" />
      </div>
    );
  };

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        {/* VÙNG NÀY ĐÃ ĐƯỢC ÉP CSS CHỐNG BÔI ĐEN TUYỆT ĐỐI */}
        <div
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onContextMenu={handleContextMenu}
          style={{ 
            WebkitTouchCallout: 'none', // Chặn menu popup trên iOS
            WebkitUserSelect: 'none',   // Chặn bôi đen trên Safari
            MozUserSelect: 'none',      // Chặn bôi đen trên Firefox
            msUserSelect: 'none',       // Chặn bôi đen trên Edge
            userSelect: 'none',         // Standard
            touchAction: 'pan-y'        // Chỉ cho phép vuốt dọc để cuộn, cấm các gesture khác
          }} 
          className="relative outline-none cursor-pointer select-none"
        >
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
            onClick={(e) => e.stopPropagation()} 
          />
          <CardContent />
        </div>
      </Dropdown>

      {/* --- MOBILE BOTTOM SHEET MENU (DRAWER) --- */}
      <Drawer
        placement="bottom"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        classNames={{ body: "p-2", header: "border-b-0 pb-0" }}
        // height="auto"
        size="default"
        className="md:hidden rounded-t-4xl"
        title={<div className="text-center text-gray-400 w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />} 
        closeIcon={false}
      >
        <div className="flex flex-col gap-1 mt-4">
          <button 
            onClick={() => {
              fileInputRef.current?.click(); 
            }}
            className="flex items-center gap-4 px-4 py-4 w-full text-left bg-white active:bg-teal-50 rounded-2xl transition-colors text-gray-800 font-medium text-base"
          >
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <CameraOutlined className="text-lg" />
            </div>
            {coverUrl ? "Đổi ảnh bìa khác" : "Thêm ảnh bìa"}
          </button>

          {coverUrl && (
            <button 
              onClick={() => {
                setCoverUrl(null);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-4 px-4 py-4 w-full text-left bg-white active:bg-red-50 rounded-2xl transition-colors text-red-600 font-medium text-base"
            >
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <DeleteOutlined className="text-lg" />
              </div>
              Xóa ảnh bìa
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
  const trips = MOCK_TRIPS;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-black text-gray-900 tracking-tight">Lịch trình</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{trips.length} hành trình</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="rounded-2xl font-bold hidden md:flex bg-teal-600 hover:bg-teal-500 shadow-sm border-0 h-12 px-6"
        >
          Tạo mới
        </Button>
      </div>

      {trips.length === 0 ? (
        <Empty description="Chưa có hành trình nào" className="py-16" />
      ) : (
        <div className="space-y-4 mb-6">
          {trips.map((t) => (
            <TripCard 
              key={t.id} 
              trip={t} 
              onClick={() => router.push(APP_ROUTES.MAIN.TRIP_DETAIL(t.id))} 
            />
          ))}
        </div>
      )}

      {/* Gợi ý cho người dùng */}
      <div className="flex justify-center mt-6 mb-20">
        <span className="px-4 py-2 bg-gray-100/80 rounded-full text-[11px] text-gray-500 font-medium shadow-sm">
          <span className="md:hidden">👆 Nhấn giữ hành trình để đổi ảnh bìa</span>
          <span className="hidden md:inline">🖱️ Chuột phải vào hành trình để đổi ảnh bìa</span>
        </span>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-teal-600 text-white
                   flex items-center justify-center shadow-lg active:scale-90 transition-all duration-200 md:hidden"
      >
        <PlusOutlined className="text-2xl" />
      </button>

      <CreateTripModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
