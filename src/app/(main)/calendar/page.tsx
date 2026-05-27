"use client";

import { useState, useMemo } from "react";
import { Calendar, Badge, ConfigProvider } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { CalendarDays, Clock, MapPin, ArrowRight, PlaneTakeoff, Milestone } from "lucide-react";
import Link from "next/link";
import viVN from "antd/locale/vi_VN";

// Import dữ liệu theo cấu trúc chuẩn Model hệ thống của bạn
import { MOCK_ITINERARY_DAYS, MOCK_TRIPS } from "@/lib/mockData";
import { TripStatus, LocationCategory } from "@/models";
import { CreateTripModal } from "@/components/modals/CreateTripModal";

dayjs.locale("vi");

// Hàm map trạng thái chuyến đi sang màu sắc Badge của Antd
const mapStatusToBadgeType = (status: TripStatus) => {
  switch (status) {
    case "planning": return "warning";    // Vàng
    case "ongoing": return "processing";  // Xanh dương
    case "completed": return "success";   // Xanh lá
    default: return "default";
  }
};

// Hàm map danh mục địa điểm sang icon trực quan ở Sidebar
const getLocationIcon = (category: LocationCategory) => {
  switch (category) {
    case "transport": return <PlaneTakeoff className="w-4 h-4 text-amber-500" />;
    case "accommodation": return <MapPin className="w-4 h-4 text-blue-500" />;
    default: return <Milestone className="w-4 h-4 text-teal-500" />;
  }
};

export default function CalendarPage() {
  // Mặc định chọn ngày 24/04/2026 để hiển thị ngay data mẫu dữ liệu mới
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs("2026-04-24"));
  const [showCreate, setShowCreate] = useState(false);
  // Tách biệt và tối ưu hóa cấu trúc dữ liệu cho Lịch và Sidebar bằng useMemo
  const { gridMap, sidebarMap } = useMemo(() => {
    const grid: Record<string, any[]> = {};
    const sidebar: Record<string, any[]> = {};
    
    MOCK_ITINERARY_DAYS.forEach((day) => {
      // 1. 🔥 FIX TẠI ĐÂY: Phân tách chính xác địa điểm về đúng ngày của nó
      if (day.locations && Array.isArray(day.locations)) {
        day.locations.forEach((loc) => {
          // Lấy ngày của chính địa điểm (loc.date), nếu không có mới fallback về day.date
          const targetDate = loc.date || day.date;
          
          if (!sidebar[targetDate]) {
            sidebar[targetDate] = [];
          }
          
          // Tránh trùng lặp địa điểm trong cùng một ngày khi map
          const isLocExisted = sidebar[targetDate].some((l) => l.id === loc.id);
          if (!isLocExisted) {
            sidebar[targetDate].push(loc);
          }
        });
      }

      // 2. Map dữ liệu tổng quan Trip cho ô lịch (Grid)
      const currentTrip = MOCK_TRIPS.find((t) => t.id === day.tripId);
      if (currentTrip) {
        if (!grid[day.date]) grid[day.date] = [];
        
        const isExisted = grid[day.date].some((t) => t.id === currentTrip.id);
        if (!isExisted) {
          grid[day.date].push({
            id: currentTrip.id,
            name: currentTrip.name,
            dayCount: currentTrip.dayCount,       // Số ngày của trip
            locationCount: currentTrip.locationCount, // Số địa điểm của trip
            type: mapStatusToBadgeType(currentTrip.status),
          });
        }
      }
    });
    
    return { gridMap: grid, sidebarMap: sidebar };
  }, []);

  const dateKey = selectedDate.format("YYYY-MM-DD");
  
  // Lấy danh sách địa điểm chi tiết và lọc CHÍNH XÁC theo ngày được chọn
  const todayLocations = useMemo(() => {
    const locations = sidebarMap[dateKey] || [];
    return locations.filter((loc) => !loc.date || loc.date === dateKey);
  }, [sidebarMap, dateKey]);

  // Tìm thông tin trip của ngày đó để hiển thị tên Trip lên Sidebar
  const currentDayTripId = todayLocations[0]?.tripId;
  const currentTripInfo = useMemo(() => {
    if (!currentDayTripId) return null;
    return MOCK_TRIPS.find((t) => t.id === currentDayTripId);
  }, [currentDayTripId]);

  // Render nội dung ô lịch: Chỉ hiển thị thông tin chung của Trip
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
      const formattedDate = current.format("YYYY-MM-DD");
      const tripsInDay = gridMap[formattedDate] || [];
      
      return (
        <ul className="m-0 p-0 list-none flex flex-col md:block items-center">
          {tripsInDay.map((trip, index) => (
            <li key={index} className="mb-1 w-full">
              
              {/* 📱 VIEW MOBILE: Chỉ hiện chấm tròn (Badge) để không bị vỡ layout */}
              <div className="md:hidden flex justify-center items-center mt-1">
                <Badge status={trip.type} />
              </div>

              {/* 💻 VIEW DESKTOP: Hiện đầy đủ thông tin Trip */}
              <div className="hidden md:block bg-teal-50/60 p-1 rounded border border-teal-100/50 transition-all hover:shadow-sm">
                <div className="font-semibold text-[11px] text-teal-900 truncate flex items-center gap-1">
                  <Badge status={trip.type} className="scale-75 origin-left" />
                  <span className="truncate">{trip.name}</span>
                </div>
                <div className="text-[9px] text-gray-500 pl-2 mt-0.5 font-medium">
                  {trip.dayCount} ngày • {trip.locationCount} chỗ
                </div>
              </div>

            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 px-2 sm:px-6 md:py-8 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CalendarDays className="w-7 h-7 md:w-8 md:h-8 text-teal-600" />
              Lịch trình của tôi
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
              Quản lý và xem chi tiết lộ trình di chuyển hàng ngày của bạn
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <button onClick={() => setShowCreate(true)} className="w-full bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow shadow-teal-500/20">
              <PlaneTakeoff className="w-5 h-5" />
              Lên lịch đi mới
            </button>
            <CreateTripModal open={showCreate} onClose={() => setShowCreate(false)} onSave={() => {}} />
          </div>
        </div>

        {/* Main Content: Split View */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          
          {/* Lịch bên trái */}
          <div className="xl:col-span-3 bg-white p-2 sm:p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
            <ConfigProvider locale={viVN}>
              <div className="[&_.ant-picker-calendar-header]:px-2 [&_.ant-picker-calendar-header]:pb-2">
                <Calendar 
                  value={selectedDate}
                  cellRender={cellRender} 
                  onSelect={setSelectedDate}
                  className="w-full"
                />
              </div>
            </ConfigProvider>
          </div>

          {/* Sidebar chi tiết lịch trình của ngày được click bên phải */}
          <div className="xl:col-span-1">
            <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 xl:sticky xl:top-24 min-h-[300px] md:min-h-[450px] flex flex-col justify-between">
              
              <div>
                {/* Header Sidebar - Đã thêm hiển thị Tên Trip */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 border-b pb-3 md:pb-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span>Lộ trình chi tiết</span>
                    <span className="text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full text-[11px] md:text-xs font-semibold">
                      {selectedDate.format("DD/MM/YYYY")}
                    </span>
                  </div>
                  
                  {/* 🔥 HIỂN THỊ TÊN TRIP TẠI ĐÂY */}
                  {currentTripInfo && (
                    <div className="text-[11px] md:text-xs text-teal-800 font-medium flex items-center gap-1.5 mt-1 bg-teal-50/40 px-2.5 py-1.5 rounded-xl border border-teal-100/30 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                      <span className="truncate">Chuyến đi: <strong className="font-semibold text-gray-800">{currentTripInfo.name}</strong></span>
                    </div>
                  )}
                </h3>

                {/* Timeline địa điểm */}
                {todayLocations.length > 0 ? (
                  <div className="space-y-5 pl-2 relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-gray-100 mt-4">
                    {todayLocations
                      .sort((a, b) => a.order - b.order) // Sắp xếp theo thứ tự order của database
                      .map((loc, idx) => (
                        <div key={idx} className="flex gap-3 relative group">
                          {/* Điểm nút Timeline */}
                          <div className="w-6 h-6 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center z-10 shrink-0 shadow-sm group-hover:bg-teal-50 transition-colors">
                            {getLocationIcon(loc.category)}
                          </div>
                          
                          {/* Nội dung địa điểm */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-gray-400 font-medium">
                              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                              <span>{loc.startTime || "Chưa set giờ"} {loc.endTime ? `- ${loc.endTime}` : ""}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm mt-0.5 group-hover:text-teal-600 transition-colors whitespace-normal md:truncate">
                              {loc.name}
                            </h4>
                            {loc.address && (
                              <p className="text-[11px] md:text-xs text-gray-400 truncate mt-0.5">
                                {loc.address}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10 md:py-16 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Milestone className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Trống lịch trình</p>
                    <p className="text-gray-300 text-[11px] md:text-xs mt-1">Không có địa điểm nào cho ngày này</p>
                  </div>
                )}
              </div>

              {/* Nút điều hướng thông minh xuống đáy Sidebar */}
              {todayLocations.length > 0 && currentDayTripId && (
                <div className="border-t pt-4 mt-6">
                  <Link 
                    href={`/trips/${currentDayTripId}`} 
                    className="w-full bg-gray-50 hover:bg-teal-50 hover:text-teal-700 text-gray-600 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-gray-100 hover:border-teal-200"
                  >
                    Quản lý / Chỉnh sửa chuyến đi 
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}