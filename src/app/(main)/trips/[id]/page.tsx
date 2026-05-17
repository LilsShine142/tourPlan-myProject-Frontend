// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Tag } from "antd";
// import {
//   ArrowLeftOutlined,
//   EllipsisOutlined,
//   SearchOutlined,
//   PlusOutlined,
//   ClockCircleOutlined,
//   MenuUnfoldOutlined,
//   MenuFoldOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CheckSquareOutlined,
//   CloseOutlined,
//   CalendarOutlined,
//   DownloadOutlined,
//   CompassOutlined,
//   SendOutlined,
//   EnvironmentOutlined,
// } from "@ant-design/icons";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { APP_ROUTES } from "@/config/routes";
// import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from "@/lib/mockData";
// import { formatDayOfWeek } from "@/utils";
// import { ItineraryLocation } from "@/models";
// import { useUIStore } from "@/store/zustandStore";
// import { SpinnerLoading } from "@/components/ui/loaders";

// type FilterTab = "all" | "group" | "personal";

// interface ChecklistItem {
//   id: string;
//   label: string;
//   checked: boolean;
// }

// const MOCK_CHECKLIST: ChecklistItem[] = [
//   { id: "1", label: "Mua kem chống nắng", checked: true },
//   { id: "2", label: "Đặt vé xe Thành Bưởi", checked: false },
//   { id: "3", label: "Sạc dự phòng", checked: false },
//   { id: "4", label: "Thuê xe máy tại Đà Lạt", checked: false },
// ];

// export default function TripDetailPage() {
//   const router = useRouter();
//   const trip = MOCK_TRIPS[0];
//   const days = MOCK_ITINERARY_DAYS;

//   const { globalLoading, setGlobalLoading } = useUIStore();

//   // ── States ──
//   const [isMounted, setIsMounted] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop
  
//   // States cho Mobile Bottom Sheet
//   const [isExpanded, setIsExpanded] = useState(false); 
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState(0);
//   const startY = useRef(0);

//   const [activeTab, setActiveTab] = useState<"itinerary" | "checklist">("itinerary");
//   const [filterTab, setFilterTab] = useState<FilterTab>("all");
//   const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
//   const [newTask, setNewTask] = useState("");

//   // ── Initialization ──
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return <SpinnerLoading text="Đang chuẩn bị dữ liệu chuyến đi..." />;
//   }

//   // ── Handlers Checklists ──
//   const toggleCheck = (id: string) => {
//     setChecklistItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
//   };

//   const addTask = () => {
//     if (!newTask.trim()) return;
//     setChecklistItems((prev) => [...prev, { id: Date.now().toString(), label: newTask.trim(), checked: false }]);
//     setNewTask("");
//   };

//   // ── Pointer Drag Logic ──
//   const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//     e.currentTarget.setPointerCapture(e.pointerId);
//     startY.current = e.clientY;
//     setIsDragging(true);
//     setDragOffset(0);
//   };

//   const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!isDragging) return;
//     const deltaY = e.clientY - startY.current;
    
//     if (isExpanded && deltaY < 0) {
//       setDragOffset(deltaY * 0.15);
//     } else if (!isExpanded && deltaY > 0) {
//       setDragOffset(deltaY * 0.15);
//     } else {
//       setDragOffset(deltaY);
//     }
//   };

//   const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!isDragging) return;
//     e.currentTarget.releasePointerCapture(e.pointerId);
//     setIsDragging(false);

//     if (Math.abs(dragOffset) < 5) {
//       setIsExpanded(!isExpanded);
//     } else {
//       if (isExpanded && dragOffset > 50) setIsExpanded(false); 
//       if (!isExpanded && dragOffset < -50) setIsExpanded(true); 
//     }
//     setDragOffset(0);
//   };

//   const totalLocations = days.reduce((s, d) => s + d.locations.length, 0);

//   const getSheetTransform = () => {
//     if (isDragging) {
//       return isExpanded 
//         ? `translateY(${dragOffset}px)` 
//         : `translateY(calc(100% - 80px + ${dragOffset}px))`;
//     }
//     return isExpanded ? `translateY(0)` : `translateY(calc(100% - 80px))`;
//   };

//   // ── Render Functions (Thay vì khai báo Component lồng nhau) ──
//   const renderLocationCard = (loc: ItineraryLocation) => (
//     <div key={loc.id} className="flex items-start gap-3 bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
//       <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0 mt-0.5">
//         <EnvironmentOutlined />
//       </div>
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between gap-2 mb-1">
//           <span className="font-semibold text-gray-900 truncate">{loc.name}</span>
//           <Tag
//             color="cyan"
//             className="rounded-full text-[10px] cursor-pointer shrink-0 m-0"
//             onClick={() => window.open(`http://maps.google.com/maps?q=$${loc.lat},${loc.lng}`, "_blank")}
//           >
//             Bản đồ ↗
//           </Tag>
//         </div>
//         {loc.address && <p className="text-xs text-gray-500 truncate">{loc.address}</p>}
//         {(loc.startTime || loc.endTime) && (
//           <div className="mt-2.5 inline-flex items-center gap-1.5 bg-primary/5 text-primary rounded-full px-2.5 py-1 text-[11px] font-medium border border-primary/10">
//             <ClockCircleOutlined />
//             {loc.startTime}
//             {loc.endTime ? ` – ${loc.endTime}` : ""}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderItineraryContent = () => (
//     <div className="space-y-6">
//       {days.map((day) => (
//         <div key={day.id}>
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
//               {day.dayNumber}
//             </div>
//             <div className="flex-1">
//               <p className="font-bold text-gray-900 text-sm">{formatDayOfWeek(day.date)}</p>
//               <p className="text-xs text-gray-500">{day.locations.length} địa điểm</p>
//             </div>
//             <button className="w-8 h-8 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors">
//               <CompassOutlined />
//             </button>
//           </div>
//           <div className="ml-4 pl-4 border-l-2 border-dashed border-primary/20 space-y-4">
//             {day.locations.map((loc) => renderLocationCard(loc))}
//           </div>
//         </div>
//       ))}
//       <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2">
//         <PlusOutlined /> Thêm địa điểm
//       </button>
//     </div>
//   );

//   const renderChecklistContent = () => (
//     <div className="flex flex-col h-full min-h-0">
//       {checklistItems.length === 0 ? (
//         <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
//           <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
//             <CheckSquareOutlined className="text-3xl text-orange-400" />
//           </div>
//           <p className="font-bold text-gray-800 text-base">Chưa có mục nào</p>
//           <p className="text-sm text-gray-400 mt-1">Thêm việc cần làm cho chuyến đi</p>
//         </div>
//       ) : (
//         <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
//           {checklistItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => toggleCheck(item.id)}
//               className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100 transition-all duration-200 text-left"
//             >
//               <div
//                 className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
//                   item.checked ? "bg-primary border-primary" : "border-gray-300 bg-white"
//                 }`}
//               >
//                 {item.checked && <CloseOutlined style={{ fontSize: 10, color: "white", fontWeight: 800 }} />}
//               </div>
//               <span className={`text-sm font-medium transition-all ${item.checked ? "text-gray-400 line-through" : "text-gray-700"}`}>
//                 {item.label}
//               </span>
//             </button>
//           ))}
//         </div>
//       )}
//       <div className="mt-4 flex items-center gap-2 bg-orange-50/50 rounded-2xl px-4 py-3 border border-orange-100 shrink-0">
//         <PlusOutlined className="text-orange-400 text-sm shrink-0" />
//         <input
//           type="text"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && addTask()}
//           placeholder="Thêm việc cần làm..."
//           className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none min-w-0"
//         />
//         <button
//           onClick={addTask}
//           disabled={!newTask.trim()}
//           className="w-8 h-8 rounded-full bg-gray-200 hover:bg-primary hover:text-white disabled:opacity-40 flex items-center justify-center transition-all duration-200 shrink-0"
//         >
//           <SendOutlined style={{ fontSize: 13 }} />
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-gray-100">
//       {/* ══════════════════════════════════════════
//           BẢN ĐỒ CHUNG 
//       ════════════════════════════════════════ */}
//       <div className="absolute inset-0 z-0 bg-slate-200">
//         <iframe
//           src="https://maps.google.com/maps?q=11.9427,108.4361&z=14&output=embed"
//           className="w-full h-full pointer-events-auto"
//           style={{ border: 0 }}
//           allowFullScreen
//           loading="lazy"
//         />
//       </div>

//       {/* ══════════════════════════════════════════
//           TOPBAR CHUNG
//       ══════════════════════════════════════════ */}
//       <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3 pointer-events-none">
//         <Link
//           href={APP_ROUTES.MAIN.TRIPS}
//           className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-sm hover:bg-white transition-colors border border-gray-100"
//         >
//           <ArrowLeftOutlined className="text-gray-700" />
//           <span className="font-bold text-gray-900 truncate max-w-37.5 md:max-w-none text-sm">{trip.name}</span>
//         </Link>
//         <div className="flex items-center gap-2 pointer-events-auto">
//           <button className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors border border-gray-100">
//             <SearchOutlined className="text-gray-700" />
//           </button>
//           <button className="hidden md:flex w-10 h-10 bg-white/95 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-white transition-colors border border-gray-100">
//             <EllipsisOutlined className="text-gray-700" />
//           </button>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════════
//           DESKTOP LAYOUT 
//       ══════════════════════════════════════════ */}
//       <div className="hidden md:block absolute inset-0 z-10 pointer-events-none mt-20">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-white shadow-[4px_0_24px_rgba(0,0,0,0.06)] border border-gray-100 border-l-0 px-1.5 py-6 rounded-r-2xl hover:bg-gray-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
//             sidebarOpen ? "left-103.75" : "left-3.75"
//           }`}
//         >
//           {sidebarOpen ? <MenuFoldOutlined className="text-gray-500" /> : <MenuUnfoldOutlined className="text-gray-500" />}
//         </button>

//         <aside
//           className={`absolute -top-3.75 bottom-22.5 left-3.75 w-100 bg-white rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
//             sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+30px)]"
//           }`}
//         >
//           <div className="px-6 pt-5 pb-4 border-b border-gray-50 shrink-0">
//             <div className="flex items-center gap-2 flex-wrap">
//               <Tag color="cyan" className="rounded-full border-0 bg-cyan-50 text-cyan-600 font-medium">
//                 <CalendarOutlined className="mr-1.5" />{days.length} ngày
//               </Tag>
//               <Tag color="green" className="rounded-full border-0 bg-green-50 text-green-600 font-medium">
//                 <DownloadOutlined className="mr-1.5" />{totalLocations} điểm
//               </Tag>
//               <Tag color="default" className="rounded-full border-0 bg-gray-100 text-gray-600 font-medium">
//                 <TeamOutlined className="mr-1.5" />{trip.members.length}
//               </Tag>
//             </div>
//           </div>
//           <div className="px-6 pt-4 shrink-0">
//             <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-4">
//               {(["itinerary", "checklist"] as const).map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
//                     activeTab === t ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {t === "itinerary" ? "Lịch trình" : "Checklist"}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="flex-1 overflow-y-auto min-h-0 px-6 py-2 pb-6">
//             {activeTab === "itinerary" ? renderItineraryContent() : renderChecklistContent()}
//           </div>
//         </aside>
//       </div>

//       {/* ══════════════════════════════════════════
//           MOBILE LAYOUT
//       ══════════════════════════════════════════ */}
      
//       {/* 1. OVERLAY MỜ */}
//       <div
//         className={`md:hidden absolute inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-opacity duration-300 ${
//           isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setIsExpanded(false)}
//       />

//       {/* 2. BOTTOM SHEET PANEL */}
//       <div
//         className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[75vh] will-change-transform"
//         style={{
//           transform: getSheetTransform(),
//           transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.32,0.72,0,1)'
//         }}
//       >
//         {/* SUMMARY HEADER (Drag Handle) */}
//         <div 
//           className="h-20 shrink-0 flex flex-col justify-center px-6 cursor-grab active:cursor-grabbing border-b border-gray-50 bg-white rounded-t-4xl select-none touch-none"
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={handlePointerUp}
//           onPointerCancel={handlePointerUp}
//         >
//           <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
//           <div className="flex items-center justify-between">
//             <div className="flex-1 min-w-0 pr-4">
//               <span className="font-bold text-gray-900 text-base truncate block leading-tight">{trip.name}</span>
//               <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
//                 <span><CalendarOutlined className="mr-1" />{days.length} ngày</span>
//                 <span className="w-1 h-1 rounded-full bg-gray-300"></span>
//                 <span><TeamOutlined className="mr-1" />{trip.members.length} người</span>
//               </p>
//             </div>
//             <div className="shrink-0">
//               <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[11px] font-bold">
//                 {totalLocations} điểm
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* NỘI DUNG SHEET */}
//         <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 delay-100 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
//           <div className="px-6 pt-4 pb-2 shrink-0 bg-white">
//             <div className="flex bg-gray-100/80 p-1 rounded-xl mb-2">
//               {(["itinerary", "checklist"] as const).map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
//                     activeTab === t ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {t === "itinerary" ? "Lịch trình" : "Checklist"}
//                 </button>
//               ))}
//             </div>
//             {activeTab === "itinerary" && (
//               <div className="flex gap-1.5 mt-3 mb-2">
//                 {(["all", "group", "personal"] as FilterTab[]).map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setFilterTab(tab)}
//                     className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
//                       filterTab === tab ? "bg-primary/5 text-primary border-primary/20" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
//                     }`}
//                   >
//                     {tab === "all" ? "Tất cả" : tab === "group" ? "Nhóm" : "Cá nhân"}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           {/* Scroll Container */}
//           <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
//             {activeTab === "itinerary" ? renderItineraryContent() : renderChecklistContent()}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }




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
  CheckSquareOutlined,
  CloseOutlined,
  CalendarOutlined,
  DownloadOutlined,
  CompassOutlined,
  SendOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ManOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { APP_ROUTES } from "@/config/routes";
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from "@/lib/mockData";
import { formatDayOfWeek } from "@/utils";
import { ItineraryLocation } from "@/models";
import { useUIStore } from "@/store/zustandStore";
import { SpinnerLoading } from "@/components/ui/loaders";
import { useParams, useRouter } from "next/navigation";
// GRID MENU (Các công cụ chuyến đi)
import renderGridMenu from "@/app/(main)/components/RenderGridMenu";

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
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
  const trip = MOCK_TRIPS.find(t => t.id === id);
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
      <button 
        onClick={() => trip?.id && router.push(`/trips/${trip.id}/itinerary`)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
      >
        <PlusOutlined /> Thêm / Sắp xếp địa điểm
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
          <span className="font-bold text-gray-900 truncate max-w-37.5 md:max-w-none text-sm">{trip?.name}</span>
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
                <TeamOutlined className="mr-1.5" />{trip?.members.length}
              </Tag>
            </div>
          </div>
          
          <div className="px-6 pt-4 shrink-0">
            {/* GRID MENU DESKTOP */}
            {renderGridMenu()}

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
        className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[85vh] will-change-transform"
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
              <span className="font-bold text-gray-900 text-base truncate block leading-tight">{trip?.name}</span>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                <span><CalendarOutlined className="mr-1" />{days.length} ngày</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span><TeamOutlined className="mr-1" />{trip?.members.length} người</span>
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
            
            {/* GRID MENU MOBILE */}
            {renderGridMenu()}

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