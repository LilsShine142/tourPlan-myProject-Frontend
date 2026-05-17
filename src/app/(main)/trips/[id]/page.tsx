"use client";

import { useState, useEffect, useRef } from "react";
import { Tag } from "antd";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  SearchOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  UserOutlined,
  CheckSquareOutlined,
  CloseOutlined,
  CalendarOutlined,
  DownloadOutlined,
  CompassOutlined,
  SendOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/config/routes";
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from "@/lib/mockData";
import { formatDayOfWeek } from "@/utils";
import { ItineraryLocation } from "@/models";
import { useUIStore } from "@/store/zustandStore";
import { SpinnerLoading } from "@/components/ui/loaders";

type FilterTab = "all" | "group" | "personal";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: "1", label: "Mua kem chống nắng", checked: true },
  { id: "2", label: "Đặt vé xe Thành Bưởi", checked: false },
  { id: "3", label: "Sạc dự phòng", checked: false },
  { id: "4", label: "Thuê xe máy tại Đà Lạt", checked: false },
];

export default function TripDetailPage() {
  const router = useRouter();
  const trip = MOCK_TRIPS[0];
  const days = MOCK_ITINERARY_DAYS;

  const { globalLoading, setGlobalLoading } = useUIStore();

  // ── States ──
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop
  
  // States cho Mobile Bottom Sheet
  const [isExpanded, setIsExpanded] = useState(false); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);

  const [activeTab, setActiveTab] = useState<"itinerary" | "checklist">("itinerary");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [newTask, setNewTask] = useState("");

  // ── Initialization ──
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SpinnerLoading text="Đang chuẩn bị dữ liệu chuyến đi..." />;
  }

  // ── Handlers Checklists ──
  const toggleCheck = (id: string) => {
    setChecklistItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setChecklistItems((prev) => [...prev, { id: Date.now().toString(), label: newTask.trim(), checked: false }]);
    setNewTask("");
  };

  // ── Pointer Drag Logic ──
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY.current;
    
    if (isExpanded && deltaY < 0) {
      setDragOffset(deltaY * 0.15);
    } else if (!isExpanded && deltaY > 0) {
      setDragOffset(deltaY * 0.15);
    } else {
      setDragOffset(deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    if (Math.abs(dragOffset) < 5) {
      setIsExpanded(!isExpanded);
    } else {
      if (isExpanded && dragOffset > 50) setIsExpanded(false); 
      if (!isExpanded && dragOffset < -50) setIsExpanded(true); 
    }
    setDragOffset(0);
  };

  const totalLocations = days.reduce((s, d) => s + d.locations.length, 0);

  const getSheetTransform = () => {
    if (isDragging) {
      return isExpanded 
        ? `translateY(${dragOffset}px)` 
        : `translateY(calc(100% - 80px + ${dragOffset}px))`;
    }
    return isExpanded ? `translateY(0)` : `translateY(calc(100% - 80px))`;
  };

  // ── Render Functions (Thay vì khai báo Component lồng nhau) ──
  const renderLocationCard = (loc: ItineraryLocation) => (
    <div key={loc.id} className="flex items-start gap-3 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0 mt-0.5">
        <EnvironmentOutlined />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-gray-900 truncate">{loc.name}</span>
          <Tag
            color="cyan"
            className="rounded-full text-[10px] cursor-pointer shrink-0 m-0"
            onClick={() => window.open(`http://maps.google.com/maps?q=$${loc.lat},${loc.lng}`, "_blank")}
          >
            Bản đồ ↗
          </Tag>
        </div>
        {loc.address && <p className="text-xs text-gray-500 truncate">{loc.address}</p>}
        {(loc.startTime || loc.endTime) && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-primary/5 text-primary rounded-full px-2.5 py-1 text-[11px] font-medium border border-primary/10">
            <ClockCircleOutlined />
            {loc.startTime}
            {loc.endTime ? ` – ${loc.endTime}` : ""}
          </div>
        )}
      </div>
    </div>
  );

  const renderItineraryContent = () => (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day.id}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
              {day.dayNumber}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{formatDayOfWeek(day.date)}</p>
              <p className="text-xs text-gray-500">{day.locations.length} địa điểm</p>
            </div>
            <button className="w-8 h-8 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors">
              <CompassOutlined />
            </button>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-dashed border-primary/20 space-y-4">
            {day.locations.map((loc) => renderLocationCard(loc))}
          </div>
        </div>
      ))}
      <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2">
        <PlusOutlined /> Thêm địa điểm
      </button>
    </div>
  );

  const renderChecklistContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {checklistItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <CheckSquareOutlined className="text-3xl text-orange-400" />
          </div>
          <p className="font-bold text-gray-800 text-base">Chưa có mục nào</p>
          <p className="text-sm text-gray-400 mt-1">Thêm việc cần làm cho chuyến đi</p>
        </div>
      ) : (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {checklistItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100 transition-all duration-200 text-left"
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  item.checked ? "bg-primary border-primary" : "border-gray-300 bg-white"
                }`}
              >
                {item.checked && <CloseOutlined style={{ fontSize: 10, color: "white", fontWeight: 800 }} />}
              </div>
              <span className={`text-sm font-medium transition-all ${item.checked ? "text-gray-400 line-through" : "text-gray-700"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center gap-2 bg-orange-50/50 rounded-2xl px-4 py-3 border border-orange-100 shrink-0">
        <PlusOutlined className="text-orange-400 text-sm shrink-0" />
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Thêm việc cần làm..."
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0"
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-primary hover:text-white disabled:opacity-40 flex items-center justify-center transition-all duration-200 shrink-0"
        >
          <SendOutlined style={{ fontSize: 13 }} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-gray-100">
      {/* ══════════════════════════════════════════
          BẢN ĐỒ CHUNG 
      ════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <iframe
          src="https://maps.google.com/maps?q=11.9427,108.4361&z=14&output=embed"
          className="w-full h-full pointer-events-auto"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* ══════════════════════════════════════════
          TOPBAR CHUNG
      ══════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3 pointer-events-none">
        <Link
          href={APP_ROUTES.MAIN.TRIPS}
          className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-sm hover:bg-white transition-colors border border-gray-100"
        >
          <ArrowLeftOutlined className="text-gray-700" />
          <span className="font-bold text-gray-900 truncate max-w-37.5 md:max-w-none text-sm">{trip.name}</span>
        </Link>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors border border-gray-100">
            <SearchOutlined className="text-gray-700" />
          </button>
          <button className="hidden md:flex w-10 h-10 bg-white/95 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-white transition-colors border border-gray-100">
            <EllipsisOutlined className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT 
      ══════════════════════════════════════════ */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none mt-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-white shadow-[4px_0_24px_rgba(0,0,0,0.06)] border border-gray-100 border-l-0 px-1.5 py-6 rounded-r-2xl hover:bg-gray-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            sidebarOpen ? "left-103.75" : "left-3.75"
          }`}
        >
          {sidebarOpen ? <MenuFoldOutlined className="text-gray-500" /> : <MenuUnfoldOutlined className="text-gray-500" />}
        </button>

        <aside
          className={`absolute -top-3.75 bottom-22.5 left-3.75 w-100 bg-white rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+30px)]"
          }`}
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag color="cyan" className="rounded-full border-0 bg-cyan-50 text-cyan-600 font-medium">
                <CalendarOutlined className="mr-1.5" />{days.length} ngày
              </Tag>
              <Tag color="green" className="rounded-full border-0 bg-green-50 text-green-600 font-medium">
                <DownloadOutlined className="mr-1.5" />{totalLocations} điểm
              </Tag>
              <Tag color="default" className="rounded-full border-0 bg-gray-100 text-gray-600 font-medium">
                <TeamOutlined className="mr-1.5" />{trip.members.length}
              </Tag>
            </div>
          </div>
          <div className="px-6 pt-4 shrink-0">
            <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-4">
              {(["itinerary", "checklist"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                    activeTab === t ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "itinerary" ? "Lịch trình" : "Checklist"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 pb-6">
            {activeTab === "itinerary" ? renderItineraryContent() : renderChecklistContent()}
          </div>
        </aside>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════ */}
      
      {/* 1. OVERLAY MỜ */}
      <div
        className={`md:hidden absolute inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-opacity duration-300 ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsExpanded(false)}
      />

      {/* 2. BOTTOM SHEET PANEL */}
      <div
        className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[75vh] will-change-transform"
        style={{
          transform: getSheetTransform(),
          transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.32,0.72,0,1)'
        }}
      >
        {/* SUMMARY HEADER (Drag Handle) */}
        <div 
          className="h-20 shrink-0 flex flex-col justify-center px-6 cursor-grab active:cursor-grabbing border-b border-gray-50 bg-white rounded-t-4xl select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <span className="font-bold text-gray-900 text-base truncate block leading-tight">{trip.name}</span>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                <span><CalendarOutlined className="mr-1" />{days.length} ngày</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span><TeamOutlined className="mr-1" />{trip.members.length} người</span>
              </p>
            </div>
            <div className="shrink-0">
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[11px] font-bold">
                {totalLocations} điểm
              </div>
            </div>
          </div>
        </div>

        {/* NỘI DUNG SHEET */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 delay-100 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="px-6 pt-4 pb-2 shrink-0 bg-white">
            <div className="flex bg-gray-100/80 p-1 rounded-xl mb-2">
              {(["itinerary", "checklist"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === t ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "itinerary" ? "Lịch trình" : "Checklist"}
                </button>
              ))}
            </div>
            {activeTab === "itinerary" && (
              <div className="flex gap-1.5 mt-3 mb-2">
                {(["all", "group", "personal"] as FilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      filterTab === tab ? "bg-primary/5 text-primary border-primary/20" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "all" ? "Tất cả" : tab === "group" ? "Nhóm" : "Cá nhân"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Scroll Container */}
          <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
            {activeTab === "itinerary" ? renderItineraryContent() : renderChecklistContent()}
          </div>
        </div>
      </div>

    </div>
  );
}



// 'use client';

// import { 
//   MapPin, ArrowLeft, Plus, 
//   CheckSquare, Search, MoreVertical, 
//   Navigation, X, ChevronLeft, ChevronRight, ListTodo
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Drawer } from "vaul"; 
// import Link from "next/link";
// import { APP_ROUTES } from "@/config/routes";
// import { useState, useEffect } from "react";
// import { useUIStore } from "@/store/zustandStore";
// import { SpinnerLoading } from "@/components/ui/loaders";

// const MOCK_STOPS = [
//   { id: 1, time: "09:00", title: "Chợ Đà Lạt", address: "24 Đường Nguyễn Thị Minh Khai", lat: 11.9427, lng: 108.4361 },
//   { id: 2, time: "11:00", title: "Tiệm Cà Phê Túi Mơ To", address: "Hẻm 31 Sào Nam, Phường 11", lat: 11.9416, lng: 108.4842 },
//   { id: 3, time: "13:30", title: "Vườn hoa Thành phố", address: "Đường Trần Quốc Toản", lat: 11.9489, lng: 108.4503 },
// ];

// export default function TripDetailPage() {
//   const [activeTab, setActiveTab] = useState('itinerary'); 
//   const [isMounted, setIsMounted] = useState(false);
  
//   // State cho Desktop UX
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   // State cho Mobile UX (Vaul Drawer) - Các điểm dừng vuốt: 15% (tab nhỏ), 50% (nửa màn), 90% (gần full)
//   const [snap, setSnap] = useState<number | string | null>("50%");
// // Lấy state loading từ Zustand ra nếu sau này bạn cần dùng cho API
//   const { globalLoading, setGlobalLoading } = useUIStore();

//   useEffect(() => {
//     // Giả lập loading 1 chút cho mượt hoặc đợi component hydrate xong
//     setIsMounted(true);
//     // Nếu sau này fetch API, có thể dùng:
//     // setGlobalLoading(true);
//     // await fetchData();
//     // setGlobalLoading(false);
//   }, []);

//   // 1. Loading khi component chưa sẵn sàng (Tránh lỗi Hydration)
//   if (!isMounted) {
//     return <SpinnerLoading text="Đang chuẩn bị dữ liệu chuyến đi..." />;
//   }

//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-gray-200">
//       {/*  GIAO DIỆN DESKTOP & LAPTOP  */}
//       <div className="hidden md:flex h-full w-full relative">
//         {/* Bản đồ nền Desktop */}
//         <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/108.45,11.94,13,0/1200x800?access_token=YOUR_TOKEN')] bg-cover bg-center">
//            {MOCK_STOPS.map(stop => (
//              <div key={stop.id} className="absolute transition-transform hover:scale-110" style={{ left: '40%', top: '30%' }}>
//                <div className="bg-teal-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
//                  <Navigation size={16} fill="currentColor" />
//                </div>
//              </div>
//            ))}
//         </div>

//         {/* Nút Toggle mở/đóng Sidebar */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className={`absolute top-1/2 -translate-y-1/2 z-30 bg-white p-2 py-6 rounded-r-2xl shadow-[4px_0_15px_rgba(0,0,0,0.1)] border border-l-0 border-gray-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-gray-50 ${isSidebarOpen ? 'left-[415px]' : 'left-0'}`}
//         >
//           {isSidebarOpen ? <ChevronLeft size={24} className="text-gray-600" /> : <ChevronRight size={24} className="text-gray-600" />}
//         </button>

//         {/* Sidebar bo góc, cách lề */}
//         <aside 
//           className={`absolute top-[15px] bottom-[15px] left-[15px] w-[400px] bg-white rounded-[24px] shadow-2xl z-20 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}
//         >
//           <div className="p-6 border-b border-gray-100 rounded-t-[24px]">
//             <div className="flex items-center justify-between mb-6">
//               <Link href={APP_ROUTES.MAIN.TRIPS} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <ArrowLeft size={20} />
//               </Link>
//               <button className="p-2 hover:bg-gray-100 rounded-full">
//                 <MoreVertical size={20} />
//               </button>
//             </div>
//             <h1 className="text-2xl font-black text-gray-900">Đà Lạt Trip</h1>
//             <p className="text-sm font-medium text-gray-500 mt-1">12/04 - 15/04 • 2 thành viên</p>
//           </div>

//           <div className="p-4 space-y-4 flex-1 overflow-y-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Tìm kiếm điểm dừng..." 
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm outline-none"
//               />
//             </div>

//             <div className="flex bg-gray-100 p-1 rounded-xl">
//               <button 
//                 onClick={() => setActiveTab('itinerary')}
//                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'itinerary' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
//               >
//                 Lịch trình
//               </button>
//               <button 
//                 onClick={() => setActiveTab('checklist')}
//                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'checklist' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
//               >
//                 Checklist
//               </button>
//             </div>

//             {activeTab === 'itinerary' ? (
//               <div className="space-y-4 pt-2">
//                 {MOCK_STOPS.map((stop) => (
//                   <Card key={stop.id} className="p-4 border border-gray-100 hover:border-teal-300 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-2xl">
//                     <div className="flex gap-3">
//                       <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 h-fit rounded-lg">{stop.time}</div>
//                       <div>
//                         <h4 className="font-bold text-gray-800 group-hover:text-teal-600 transition-colors">{stop.title}</h4>
//                         <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
//                           <MapPin size={12} /> {stop.address}
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//                 <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-teal-500 hover:text-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 font-bold mt-6">
//                   <Plus size={18} /> Thêm điểm dừng mới
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-3 pt-2">
//                 <ChecklistItem label="Mua kem chống nắng" checked />
//                 <ChecklistItem label="Đặt vé xe Thành Bưởi" />
//                 <ChecklistItem label="Sạc dự phòng" />
//               </div>
//             )}
//           </div>
//         </aside>
//       </div>

//       {/* ==========================================
//           GIAO DIỆN MOBILE
//       ========================================== */}
//       <div className="md:hidden h-full w-full relative">
//         <Link href={APP_ROUTES.MAIN.TRIPS} className="absolute top-12 left-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-700 active:scale-95 transition-transform">
//           <ArrowLeft size={20} />
//         </Link>

//         {/* Nút FAB màu cam trôi nổi trên map */}
//         <div 
//           className="absolute right-4 transition-all duration-300 ease-out z-[40]"
//           style={{ bottom: `calc(${snap} + 20px)` }} // Tự động đẩy nút cam lên xuống theo mép Drawer
//         >
//           <button className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.4)] active:scale-90 transition-transform">
//             <ListTodo size={24} strokeWidth={2.5} />
//           </button>
//         </div>

//         {/* Bản đồ nền */}
//         <div className="absolute inset-0 bg-slate-300">
//           <iframe 
//             src="https://maps.google.com/maps?q=11.9427,108.4361&z=14&output=embed" 
//             className="w-full h-full grayscale-[0.2]"
//             style={{ border: 0 }} 
//             allowFullScreen 
//             loading="lazy"
//           ></iframe>
//         </div>

//         {/* BOTTOM SHEET DRAWER CÓ SNAP POINTS */}
//         <Drawer.Root 
//           open={true} 
//           dismissible={false} 
//           modal={false}
//           snapPoints={["15%", "50%", "90%"]}
//           activeSnapPoint={snap}
//           setActiveSnapPoint={setSnap}
//         >
//           <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] fixed bottom-0 left-0 right-0 z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
//             <Drawer.Title className="sr-only">Chi tiết lịch trình chuyến đi</Drawer.Title>
//             <Drawer.Description className="sr-only">Hiển thị danh sách các điểm đến và bản đồ</Drawer.Description>
//             <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 mt-4 mb-2" />
            
//             {/* Nội dung bên trong sẽ thay đổi tùy theo chiều cao vuốt */}
//             <div className="overflow-y-auto flex-1 p-6 pb-8 hide-scrollbar">
              
//               {/* Khi ở chế độ thu nhỏ nhất (15%) */}
//               {snap === "15%" ? (
//                 <div className="flex justify-between items-center px-2 animate-in fade-in duration-300">
//                   <div>
//                     <h3 className="font-bold text-teal-600 text-lg">Tất cả lịch trình</h3>
//                     <p className="text-xs text-gray-500 mt-1">Vuốt lên để xem toàn bộ lịch trình</p>
//                   </div>
//                   <div className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full flex items-center text-sm font-bold">
//                     <MapPin size={14} className="mr-1.5"/> 3 điểm
//                   </div>
//                 </div>
//               ) : (
//                 /* Khi ở chế độ nửa màn hoặc full màn (50% hoặc 90%) */
//                 <div className="animate-in fade-in duration-300">
//                   <div className="flex justify-between items-start mb-6">
//                     <div>
//                       <h2 className="text-2xl font-black text-gray-900">Đà Lạt Trip</h2>
//                       <p className="text-gray-500 font-medium text-sm mt-1">Hôm nay, 12 Tháng 4</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
//                         <CheckSquare size={20} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Trục dọc Timeline */}
//                   <div className="relative pl-6 border-l-2 border-dashed border-teal-200 ml-2 space-y-6">
//                     {MOCK_STOPS.map((stop) => (
//                       <div key={stop.id} className="relative">
//                         <div className="absolute -left-[33px] bg-white border-[3px] border-teal-500 w-4 h-4 rounded-full" />
//                         <div className="flex justify-between items-center mb-2">
//                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">{stop.time}</span>
//                         </div>
//                         <Card className="p-4 rounded-2xl border border-gray-100 shadow-sm bg-gray-50 active:scale-[0.98] transition-transform">
//                           <h4 className="font-bold text-gray-800">{stop.title}</h4>
//                           <p className="text-[12px] text-gray-500 flex items-center gap-1.5 mt-2">
//                             <MapPin size={12} className="text-teal-500" /> {stop.address}
//                           </p>
//                         </Card>
//                       </div>
//                     ))}
//                   </div>

//                   <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-teal-500 hover:text-teal-500 transition-all font-bold mt-8">
//                     + Thêm điểm đến
//                   </button>
//                 </div>
//               )}
//             </div>
//           </Drawer.Content>
//         </Drawer.Root>
//       </div>
//     </div>
//   );
// }

// function ChecklistItem({ label, checked = false }: { label: string, checked?: boolean }) {
//   return (
//     <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100 group transition-all cursor-pointer hover:bg-gray-100">
//       <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-all ${checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300 bg-white'}`}>
//         {checked && <X size={12} className="text-white" strokeWidth={4} />}
//       </div>
//       <span className={`text-sm font-medium transition-all ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
//         {label}
//       </span>
//     </div>
//   );
// }



// 'use client';

// import { 
//   MapPin, Clock, ArrowLeft, Plus, 
//   CheckSquare, Search, MoreVertical, 
//   Navigation, Menu, X, GripHorizontal, Loader2
// } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Drawer } from "vaul"; // Thư viện xử lý vuốt Bottom Sheet
// import Link from "next/link";
// import { APP_ROUTES } from "@/config/routes";
// import { useState } from "react";

// // Dữ liệu mẫu
// const MOCK_STOPS = [
//   { id: 1, time: "09:00", title: "Chợ Đà Lạt", address: "24 Đường Nguyễn Thị Minh Khai", lat: 11.9427, lng: 108.4361 },
//   { id: 2, time: "11:00", title: "Tiệm Cà Phê Túi Mơ To", address: "Hẻm 31 Sào Nam, Phường 11", lat: 11.9416, lng: 108.4842 },
//   { id: 3, time: "13:30", title: "Vườn hoa Thành phố", address: "Đường Trần Quốc Toản", lat: 11.9489, lng: 108.4503 },
// ];

// export default function TripDetailPage() {
//   const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'checklist'
// // Chỉ render UI khi có object 'window' (tức là đã ở trên trình duyệt)
//   // const isBrowser = typeof window !== 'undefined';

//   // if (!isBrowser) {
//   //   return (
//   //     <div className="h-screen w-full bg-white flex flex-col items-center justify-center space-y-3">
//   //       <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
//   //       <p className="text-gray-500 font-medium">Đang tải bản đồ...</p>
//   //     </div>
//   //   );
//   // }
//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-white">
      
//       {/* ------------------------------------------------------------
//           GIAO DIỆN DESKTOP & LAPTOP (Sidebar + Full Map)
//       ------------------------------------------------------------ */}
//       <div className="hidden md:flex h-full w-full">
//         {/* Sidebar bên trái */}
//         <aside className="w-[400px] h-full bg-white border-r shadow-xl z-20 flex flex-col">
//           <div className="p-6 border-b">
//             <div className="flex items-center justify-between mb-6">
//               <Link href={APP_ROUTES.MAIN.TRIPS} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <ArrowLeft size={20} />
//               </Link>
//               <button className="p-2 hover:bg-gray-100 rounded-full">
//                 <MoreVertical size={20} />
//               </button>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Đà Lạt Trip</h1>
//             <p className="text-sm text-gray-500">12/04 - 15/04 • 2 thành viên</p>
//           </div>

//           {/* Search bar & Tabs */}
//           <div className="p-4 space-y-4 flex-1 overflow-y-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Tìm kiếm điểm dừng..." 
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all text-sm"
//               />
//             </div>

//             <div className="flex bg-gray-100 p-1 rounded-xl">
//               <button 
//                 onClick={() => setActiveTab('itinerary')}
//                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'itinerary' ? 'bg-white shadow text-teal-600' : 'text-gray-500'}`}
//               >
//                 Lịch trình
//               </button>
//               <button 
//                 onClick={() => setActiveTab('checklist')}
//                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'checklist' ? 'bg-white shadow text-teal-600' : 'text-gray-500'}`}
//               >
//                 Checklist
//               </button>
//             </div>

//             {/* Content thay đổi theo Tab */}
//             {activeTab === 'itinerary' ? (
//               <div className="space-y-4 pt-2">
//                 {MOCK_STOPS.map((stop) => (
//                   <Card key={stop.id} className="p-4 border-gray-100 hover:border-teal-300 cursor-pointer transition-all group">
//                     <div className="flex gap-3">
//                       <div className="text-xs font-bold text-teal-600 w-12">{stop.time}</div>
//                       <div>
//                         <h4 className="font-bold text-gray-800 group-hover:text-teal-600">{stop.title}</h4>
//                         <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
//                           <MapPin size={12} /> {stop.address}
//                         </p>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//                 <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-teal-500 hover:text-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 font-bold">
//                   <Plus size={18} /> Thêm điểm dừng
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-3 pt-2">
//                 <ChecklistItem label="Mua kem chống nắng" checked />
//                 <ChecklistItem label="Đặt vé xe Thành Bưởi" />
//                 <ChecklistItem label="Sạc dự phòng" />
//                 <button className="w-full py-3 text-teal-600 font-bold text-sm bg-teal-50 rounded-xl mt-4">
//                   + Thêm mục kiểm tra
//                 </button>
//               </div>
//             )}
//           </div>
//         </aside>

//         {/* Bản đồ Full Screen bên phải */}
//         <div className="flex-1 relative bg-gray-200">
//            {/* Placeholder cho Google Maps - Bạn sẽ thay bằng Component Map thực tế sau */}
//            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/108.45,11.94,13,0/1200x800?access_token=YOUR_TOKEN')] bg-cover bg-center">
//               {/* Các điểm Ping giả lập */}
//               {MOCK_STOPS.map(stop => (
//                 <div key={stop.id} className="absolute transition-transform hover:scale-110" style={{ left: '40%', top: '30%' }}>
//                   <div className="bg-teal-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
//                     <Navigation size={16} fill="currentColor" />
//                   </div>
//                 </div>
//               ))}
//            </div>
//         </div>
//       </div>


//       {/* ------------------------------------------------------------
//           GIAO DIỆN MOBILE (Map background + Bottom Sheet Drawer)
//       ------------------------------------------------------------ */}
//       <div className="md:hidden h-full w-full relative">
//         {/* Nút quay lại lơ lửng */}
//         <Link href={APP_ROUTES.MAIN.TRIPS} className="absolute top-12 left-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-700">
//           <ArrowLeft size={20} />
//         </Link>

//         {/* Bản đồ nền */}
//         <div className="absolute inset-0 bg-slate-300">
//           <iframe 
//             src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31215.115858004!2d108.4361!3d11.9427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1713500000000!5m2!1svi!2s" 
//             className="w-full h-full grayscale-[0.2]"
//             style={{ border: 0 }} 
//             allowFullScreen 
//             loading="lazy"
//           ></iframe>
//         </div>

//         {/* Bottom Sheet UI - Tự động mở khi vào trang */}
//         <Drawer.Root open={true} dismissible={false} modal={false}>
//           <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] h-[92%] fixed bottom-0 left-0 right-0 z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">
            
//             {/* THÊM 2 DÒNG NÀY ĐỂ FIX LỖI ACCESSIBILITY */}
//             <Drawer.Title className="sr-only">Chi tiết lịch trình chuyến đi</Drawer.Title>
//             <Drawer.Description className="sr-only">Hiển thị bản đồ và danh sách các điểm đến</Drawer.Description>

//             {/* Thanh gạt (Handle) */}
//             <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 mt-3 mb-2" />
            
//             <div className="overflow-y-auto flex-1 p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   {/* Tiêu đề hiển thị thật cho người dùng vẫn giữ nguyên */}
//                   <h2 className="text-2xl font-black text-gray-900">Đà Lạt Trip</h2>
//                   <p className="text-gray-500 font-medium">Hôm nay, 12 Tháng 4</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
//                     <CheckSquare size={20} />
//                   </button>
//                   <button className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
//                     <Plus size={20} />
//                   </button>
//                 </div>
//               </div>

//               {/* Timeline Mobile */}
//               <div className="relative pl-6 border-l-2 border-dashed border-teal-100 ml-2 space-y-8">
//                 {MOCK_STOPS.map((stop) => (
//                   <div key={stop.id} className="relative">
//                     <div className="absolute -left-[33px] bg-white border-4 border-teal-500 w-4 h-4 rounded-full" />
//                     <div className="flex justify-between items-center mb-2">
//                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{stop.time}</span>
//                     </div>
//                     <Card className="p-4 rounded-2xl border-none shadow-sm bg-gray-50">
//                       <h4 className="font-bold text-gray-800">{stop.title}</h4>
//                       <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
//                         <MapPin size={10} /> {stop.address}
//                       </p>
//                     </Card>
//                   </div>
//                 ))}
//               </div>

//               {/* Checklist Section (Dưới timeline trên mobile) */}
//               <div className="mt-10">
//                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <CheckSquare size={18} className="text-teal-500" />
//                   Checklist quan trọng
//                 </h3>
//                 <div className="grid grid-cols-1 gap-3">
//                    <ChecklistItem label="Mua vé máy bay khứ hồi" checked />
//                    <ChecklistItem label="Thuê xe máy tại khách sạn" />
//                 </div>
//               </div>
//             </div>
//           </Drawer.Content>
//         </Drawer.Root>
//       </div>
//     </div>
//   );
// }

// // Component phụ cho Checklist item
// function ChecklistItem({ label, checked = false }: { label: string, checked?: boolean }) {
//   return (
//     <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 group transition-all">
//       <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300 bg-white'}`}>
//         {checked && <X size={12} className="text-white" strokeWidth={4} />}
//       </div>
//       <span className={`text-sm font-medium transition-all ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
//         {label}
//       </span>
//     </div>
//   );
// }



// import { MapPin, Clock, ArrowLeft, MoreHorizontal } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { APP_ROUTES } from "@/config/routes";

// export default function TripDetailPage() {
//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Cover Header */}
//       <div className="relative bg-teal-500 md:bg-gradient-to-r md:from-teal-600 md:to-teal-400 pt-12 pb-20 px-6 text-white md:rounded-b-[48px] rounded-b-[32px] shadow-sm">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <Link href={APP_ROUTES.MAIN.TRIPS} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
//               <ArrowLeft size={20} />
//             </Link>
//             <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
//               <MoreHorizontal size={20} />
//             </button>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Đà Lạt Trip</h2>
//           <p className="text-teal-50 font-medium flex items-center gap-2">
//             <Clock size={16} /> 12/04 - 15/04 • 3 ngày 2 đêm
//           </p>
//         </div>
//       </div>
      
//       {/* Timeline Content */}
//       <div className="max-w-3xl mx-auto px-4 -mt-10">
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
//           <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Ngày 1 - 12/04</h3>
          
//           <div className="relative pl-8 border-l-2 border-dashed border-teal-200 ml-2 space-y-8">
//             {/* Item 1 */}
//             <div className="relative group cursor-pointer">
//               <div className="absolute -left-[41px] bg-white border-[3px] border-teal-500 w-5 h-5 rounded-full group-hover:scale-125 transition-transform" />
//               <div className="flex justify-between mb-2 items-end">
//                 <span className="text-sm font-extrabold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">09:00 - 10:00</span>
//               </div>
//               <Card className="p-5 rounded-2xl shadow-none border border-gray-100 bg-gray-50/50 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
//                 <h4 className="font-bold text-gray-800 text-lg">Ăn sáng tại Chợ Đà Lạt</h4>
//                 <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
//                   <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
//                   <span className="line-clamp-2">24 Đường Nguyễn Thị Minh Khai, Phường 1, TP Đà Lạt</span>
//                 </div>
//               </Card>
//             </div>

//             {/* Item 2 */}
//             <div className="relative group cursor-pointer">
//               <div className="absolute -left-[41px] bg-white border-[3px] border-gray-300 w-5 h-5 rounded-full group-hover:border-teal-400 transition-colors" />
//               <div className="flex justify-between mb-2 items-end">
//                 <span className="text-sm font-bold text-gray-500">10:30 - 12:00</span>
//               </div>
//               <Card className="p-5 rounded-2xl shadow-none border border-gray-100 bg-gray-50/50 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
//                 <h4 className="font-bold text-gray-800 text-lg">Cà phê Túi Mơ To</h4>
//                 <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
//                   <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
//                   <span>Hẻm 31 Sào Nam, Phường 11, TP Đà Lạt</span>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
