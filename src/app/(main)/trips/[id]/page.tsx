"use client";

import { useState, useEffect, useRef } from "react";
import { Tag, Drawer, Button, Input, message } from "antd";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
  CalendarOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { 
  Plus, 
  Clock, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search 
} from "lucide-react"; 
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { APP_ROUTES } from "@/config/routes";
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from "@/lib/mockData";
import { formatDayOfWeek } from "@/utils";
import { ItineraryLocation } from "@/models";
import { useUIStore } from "@/store/zustandStore";
import { SpinnerLoading } from "@/components/ui/loaders";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import renderGridMenu from "@/app/(main)/components/RenderGridMenu";
import LocationCard from "./components/LocationCard";
import ItineraryContent from "./components/ItineraryContent";
import ChecklistContent from "./components/ChecklistContent";
import ItineraryBuilder from "./components/ItineraryBuilder";

type FilterTab = "all" | "group" | "personal";
type ActiveTab = "itinerary" | "checklist";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface PlaceItem {
  id: string;
  name: string;
  time?: string;
  note?: string;
  cost?: string;
}

interface DayColumn {
  id: string;
  day: string;
  date: string;
  items: PlaceItem[];
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

  // ── States Gốc ──
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Bottom sheet mobile states
  const [isExpanded, setIsExpanded] = useState(false); // sheet mở rộng hay không
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);
  // Bottom sheet handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditMode) return; // Không cho kéo khi đang edit
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

  const getSheetTransform = () => {
    if (isDragging) {
      return isExpanded
        ? `translateY(${dragOffset}px)`
        : `translateY(calc(100% - 80px + ${dragOffset}px))`;
    }
    return isExpanded ? `translateY(0)` : `translateY(calc(100% - 80px))`;
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>("itinerary");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [newTask, setNewTask] = useState("");

  // ── States Chức Năng Sắp Xếp / Chỉnh Sửa Địa Điểm (Mới thêm) ──
  const [isEditMode, setIsEditMode] = useState(false); // Bật/Tắt chế độ kéo thả builder
  const [board, setBoard] = useState<DayColumn[]>([]);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: PlaceItem } | null>(null);
  const [formData, setFormData] = useState<Partial<PlaceItem>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Mock danh sách gợi ý khi tìm kiếm địa điểm để add vào hành trình
  const MOCK_SEARCH_RESULTS = [
    { id: "p-1", name: "Quán Đương - Cà phê thung lũng" },
    { id: "p-2", name: "Chợ Đêm Đà Lạt" },
    { id: "p-3", name: "Khu du lịch Langbiang" },
    { id: "p-4", name: "Lẩu Gà Lá É Tao Ngộ" },
  ];

  // Đồng bộ dữ liệu gốc vào Board kéo thả khi component mount
  useEffect(() => {
    setIsMounted(true);
    if (days) {
      const initialBoard: DayColumn[] = days.map((d) => ({
        id: d.id || `day-${d.dayNumber}`,
        day: `Ngày ${d.dayNumber}`,
        date: formatDayOfWeek(d.date) || "Chưa chốt",
        items: d.locations.map((loc) => ({
          id: loc.id,
          name: loc.name,
          time: loc.startTime || "",
          note: loc.address || "",
          cost: "",
        })),
      }));
      setBoard(initialBoard);
    }
  }, []);

  if (!isMounted) {
    return <SpinnerLoading text="Đang chuẩn bị dữ liệu chuyến đi..." />;
  }

  // ── Logic Xử Lý Kéo Thả (Giữ nguyên từ ItineraryBuilder) ──
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newBoard = [...board];
    const sourceColIndex = newBoard.findIndex((col) => col.id === source.droppableId);
    const destColIndex = newBoard.findIndex((col) => col.id === destination.droppableId);

    const sourceCol = newBoard[sourceColIndex];
    const destCol = newBoard[destColIndex];

    const sourceItems = [...sourceCol.items];
    const destItems = source.droppableId === destination.droppableId ? sourceItems : [...destCol.items];

    const [draggedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, draggedItem);

    newBoard[sourceColIndex] = { ...sourceCol, items: sourceItems };
    if (source.droppableId !== destination.droppableId) {
      newBoard[destColIndex] = { ...destCol, items: destItems };
    }

    setBoard(newBoard);
    message.success("Đã cập nhật thứ tự địa điểm!");
  };

  const handleAddDay = () => {
    const newDayNumber = board.length + 1;
    setBoard([...board, {
      id: `day-${newDayNumber}`,
      day: `Ngày ${newDayNumber}`,
      date: "Chưa chốt",
      items: [],
    }]);
    message.success(`Đã thêm Ngày ${newDayNumber}`);
  };

  const handleSelectPlace = (place: any) => {
    if (!activeDayId) return;
    const newPlace: PlaceItem = { id: `item-${Date.now()}`, name: place.name };
    setBoard((prev) => prev.map((col) => col.id === activeDayId ? { ...col, items: [...col.items, newPlace] } : col));
    setIsAddPlaceOpen(false);
    message.success(`Đã thêm ${place.name}`);
  };

  const openPlaceDetail = (dayId: string, item: PlaceItem) => {
    setEditingItem({ dayId, item });
    setFormData({ time: item.time || "", note: item.note || "", cost: item.cost || "" });
    setIsDetailOpen(true);
  };

  const handleSaveDetail = () => {
    if (!editingItem) return;
    setBoard((prev) => prev.map(col => {
      if (col.id === editingItem.dayId) {
        return {
          ...col,
          items: col.items.map(i => i.id === editingItem.item.id ? { ...i, ...formData } : i)
        };
      }
      return col;
    }));
    setIsDetailOpen(false);
    message.success("Cập nhật thông tin địa điểm thành công!");
  };

  const handleSaveAllItinerary = () => {
    setIsEditMode(false);
    message.success("Toàn bộ lịch trình mới đã được lưu thành công!");
  };

  // ── Handlers Checklists ──
  const toggleCheck = (id: string) => {
    setChecklistItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setChecklistItems((prev) => [...prev, { id: Date.now().toString(), label: newTask.trim(), checked: false }]);
    setNewTask("");
  };


  const totalLocations = board.reduce((s, d) => s + d.items.length, 0);



  const handleOpenAddPlace = (dayId: string) => {
    setActiveDayId(dayId);
    setIsAddPlaceOpen(true);
  };
  const renderItineraryContent = () => {
    if (isEditMode)
      return (
        <ItineraryBuilder
          board={board}
          onDragEnd={onDragEnd}
          handleSaveAllItinerary={handleSaveAllItinerary}
          handleAddDay={handleAddDay}
          onAddPlace={handleOpenAddPlace}
          onOpenPlaceDetail={openPlaceDetail}
        />
      );
    // Truyền onOpenPlaceDetail cho cả mobile và desktop
    return <ItineraryContent board={board} setIsEditMode={setIsEditMode} onAddPlace={handleOpenAddPlace} onOpenPlaceDetail={openPlaceDetail} />;
  };

  const renderChecklistContent = () => (
    <ChecklistContent
      checklistItems={checklistItems}
      toggleCheck={toggleCheck}
      newTask={newTask}
      setNewTask={setNewTask}
      addTask={addTask}
    />
  );

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-gray-100">
      {/* ── BẢN ĐỒ CHUNG ── */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.2854291244383!2d108.43431147585012!3d11.954546436380644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112d4a0604b0b%3A0x8673da0e6afefaf0!2zQ2jhu6MgxJDDoCBM4bqhdA!5e0!3m2!1svi!2s!4v1716611223456!5m2!1svi!2s"
          className="w-full h-full pointer-events-auto"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* ── TOPBAR CHUNG ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3 pointer-events-none">
        <Link
          href={APP_ROUTES.MAIN.TRIPS}
          className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-sm hover:bg-white transition-colors border border-gray-100"
        >
          <ArrowLeftOutlined className="text-gray-700" />
          <span className="font-bold text-gray-900 truncate max-w-[150px] md:max-w-none text-sm">{trip?.name}</span>
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

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none mt-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-white shadow-[4px_0_24px_rgba(0,0,0,0.06)] border border-gray-100 border-l-0 px-1.5 py-6 rounded-r-2xl hover:bg-gray-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            sidebarOpen ? "left-[415px]" : "left-[15px]"
          }`}
        >
          {sidebarOpen ? <MenuFoldOutlined className="text-gray-500" /> : <MenuUnfoldOutlined className="text-gray-500" />}
        </button>

        <aside
          className={`absolute -top-[15px] bottom-[90px] left-[15px] w-[400px] bg-white rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+30px)]"
          }`}
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag color="cyan" className="rounded-full border-0 bg-cyan-50 text-cyan-600 font-medium">
                <CalendarOutlined className="mr-1.5" />{board.length} ngày
              </Tag>
              <Tag color="green" className="rounded-full border-0 bg-green-50 text-green-600 font-medium">
                <DownloadOutlined className="mr-1.5" />{totalLocations} điểm
              </Tag>
              <Tag color="default" className="rounded-full border-0 bg-gray-100 text-gray-600 font-medium">
                <TeamOutlined className="mr-1.5" />{trip?.members.length} người
              </Tag>
            </div>
          </div>
          
          <div className="px-6 pt-4 shrink-0">
            {renderGridMenu()}

            <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-4">
              {(["itinerary", "checklist"] as const).map((t) => (
                <button
                  key={t}
                  disabled={isEditMode && t === "checklist"} // Đang sửa không cho đổi tab
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                    activeTab === t ? "bg-white shadow-sm text-teal-600" : "text-gray-500 hover:text-gray-700 disabled:opacity-30"
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




      {/* ── MOBILE LAYOUT: Bottom Sheet kéo thả ── */}
      <div
        className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[85vh] will-change-transform"
        style={{
          transform: getSheetTransform(),
          transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.32,0.72,0,1)'
        }}
      >
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
                <span><CalendarOutlined className="mr-1" />{board.length} ngày</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span><TeamOutlined className="mr-1" />{trip?.members.length} người</span>
              </p>
            </div>
            <div className="shrink-0">
              <div className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full text-[11px] font-bold">
                {totalLocations} điểm
              </div>
            </div>
          </div>
        </div>

        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 delay-100 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="px-6 pt-4 pb-2 shrink-0 bg-white">
            {/* GRID MENU MOBILE */}
            {renderGridMenu()}

            <div className="flex bg-gray-100/80 p-1 rounded-xl mb-2">
              {(["itinerary", "checklist"] as const).map((t) => (
                <button
                  key={t}
                  disabled={isEditMode && t === "checklist"}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    activeTab === t ? "bg-white shadow-sm text-teal-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "itinerary" ? "Lịch trình" : "Checklist"}
                </button>
              ))}
            </div>
            {activeTab === "itinerary" && !isEditMode && (
              <div className="flex gap-1.5 mt-3 mb-2">
                {(["all", "group", "personal"] as FilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      filterTab === tab ? "bg-teal-50 text-teal-600 border-teal-200" : "bg-white text-gray-500 border-gray-200"
                    }`}
                  >
                    {tab === "all" ? "Tất cả" : tab === "group" ? "Nhóm" : "Cá nhân"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6">
            {activeTab === "itinerary" ? renderItineraryContent() : renderChecklistContent()}
          </div>
        </div>
      </div>

      {/* ── DESKTOP: Drawer cho Cập nhật hoạt động ── */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && (
        <Drawer
          title={<span className="font-bold text-lg text-gray-800">Cập nhật hoạt động</span>}
          placement="right"
          width={420}
          onClose={() => setIsDetailOpen(false)}
          open={isDetailOpen}
          styles={{ body: { padding: 0, backgroundColor: "#f9fafb" }, header: { borderBottom: "1px solid #f3f4f6", padding: "16px", backgroundColor: "#fff" } }}
          className="md:rounded-l-2xl rounded-t-3xl"
          extra={
            <Button type="primary" onClick={handleSaveDetail} className="bg-teal-600 rounded-xl font-semibold">
              Lưu lại
            </Button>
          }
        >
          {editingItem && (
            <div className="p-5 space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">{editingItem.item.name}</h3>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                    <Calendar size={12} /> Thuộc {board.find(c => c.id === editingItem.dayId)?.day}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Thời gian dự kiến</label>
                  <Input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    size="large"
                    prefix={<Clock size={16} className="text-gray-400 mr-1" />}
                    className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Chi phí ước tính</label>
                  <Input 
                    placeholder="Vd: 150,000đ, Miễn phí..."
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    size="large"
                    prefix={<DollarSign size={16} className="text-gray-400 mr-1" />}
                    className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Ghi chú hành trình</label>
                  <Input.TextArea 
                    placeholder="Nhập ghi chú cho địa điểm này..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    className="rounded-xl border-gray-200 shadow-sm p-3 text-xs font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </Drawer>
      )}

      {/* ── MOBILE: Bottom Sheet cho Cập nhật hoạt động ── */}
      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <MobileBottomSheet
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Cập nhật hoạt động"
          defaultVh={70}
          maxVh={90}
        >
          {editingItem && (
            <div className="p-5 space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">{editingItem.item.name}</h3>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                    <Calendar size={12} /> Thuộc {board.find(c => c.id === editingItem.dayId)?.day}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Thời gian dự kiến</label>
                  <Input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    size="large"
                    prefix={<Clock size={16} className="text-gray-400 mr-1" />}
                    className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Chi phí ước tính</label>
                  <Input 
                    placeholder="Vd: 150,000đ, Miễn phí..."
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    size="large"
                    prefix={<DollarSign size={16} className="text-gray-400 mr-1" />}
                    className="rounded-xl border-gray-200 h-11 shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Ghi chú hành trình</label>
                  <Input.TextArea 
                    placeholder="Nhập ghi chú cho địa điểm này..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    className="rounded-xl border-gray-200 shadow-sm p-3 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Nút lưu cho bản Mobile */}
              <div className="pt-2">
                <Button 
                  type="primary" 
                  onClick={handleSaveDetail} 
                  className="w-full bg-teal-600 rounded-xl h-11 font-bold text-sm shadow-md"
                >
                  Lưu cập nhật
                </Button>
              </div>
            </div>
          )}
        </MobileBottomSheet>
      )}

      {/* ── NÚT MỞ BOTTOM SHEET KHÁM PHÁ & THÊM ĐỊA ĐIỂM (MOBILE) ── */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAddPlaceOpen(true)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-base flex items-center gap-2"
        >
          <Plus size={18} /> Khám phá & Thêm địa điểm
        </button>
      </div>

      {/* ── MOBILE: Bottom Sheet cho Khám phá & Thêm địa điểm ── */}
      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <MobileBottomSheet
          open={isAddPlaceOpen}
          onClose={() => setIsAddPlaceOpen(false)}
          title="Khám phá & Thêm địa điểm"
          subtitle="Tìm kiếm và chọn địa điểm để thêm vào hành trình."
          defaultVh={75}
          maxVh={90}
        >
          <div className="space-y-4 p-3">
            <Input 
              size="large" 
              placeholder="Tìm kiếm địa danh, món ăn..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="text-gray-400 mr-1" size={16} />} 
              className="rounded-xl border-gray-200"
            />

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Gợi ý địa điểm nổi bật</p>
              {MOCK_SEARCH_RESULTS.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((place) => (
                <div 
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-teal-500 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <EnvironmentOutlined className="text-teal-600" />
                    <span className="text-xs font-bold text-gray-800">{place.name}</span>
                  </div>
                  <Plus size={14} className="text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </MobileBottomSheet>
      )}

      {/* ── DESKTOP: Drawer cho Khám phá & Thêm địa điểm ── */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && (
        <Drawer
          title={<span className="font-bold text-base">Khám phá & Thêm địa điểm</span>}
          placement="right"
          width={480}
          onClose={() => setIsAddPlaceOpen(false)}
          open={isAddPlaceOpen}
          styles={{
            body: { padding: "12px", backgroundColor: "#f9fafb" }
          }}
          className="rounded-3xl"
        >
          <div className="space-y-4">
            <Input 
              size="large" 
              placeholder="Tìm kiếm địa danh, món ăn..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="text-gray-400 mr-1" size={16} />} 
              className="rounded-xl border-gray-200"
            />

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Gợi ý địa điểm nổi bật</p>
              {MOCK_SEARCH_RESULTS.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((place) => (
                <div 
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-teal-500 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <EnvironmentOutlined className="text-teal-600" />
                    <span className="text-xs font-bold text-gray-800">{place.name}</span>
                  </div>
                  <Plus size={14} className="text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}