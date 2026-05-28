"use client";

import { useState, useEffect, useRef } from "react";
import { Tag, Drawer, Button, Input, message, Rate, Spin, Select } from "antd";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  SearchOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CalendarOutlined,
  DownloadOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { 
  Plus, 
  Clock, 
  MapPin, 
  DollarSign, 
  Search,
  Phone,
  Globe,
  Route as RouteIcon, 
  Calendar,
  X, // Thêm icon X để xóa điểm dừng
  ChevronUp,
  ChevronDown
} from "lucide-react"; 
import Link from "next/link";
import { useParams } from "next/navigation";
import { DropResult } from "@hello-pangea/dnd";

import { APP_ROUTES } from "@/config/routes";
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from "@/lib/mockData";
import { formatDayOfWeek } from "@/utils";
import { GlobalOverlayLoading } from "@/components/ui/loaders";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import renderGridMenu from "@/app/(main)/components/RenderGridMenu";
import ItineraryContent from "./components/ItineraryContent";
import ChecklistContent from "./components/ChecklistContent";
import ItineraryBuilder from "./components/ItineraryBuilder";
import TripDetailContent from "./components/TripDetailContent";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map, MapMarker, MapRoute, MarkerContent, type MapRef } from "@/components/ui/map";


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
  lat?: number;
  lng?: number;
  osmId?: string;
}

interface DayColumn {
  id: string;
  day: string;
  date: string;
  items: PlaceItem[];
}

interface OsmPlaceDetails {
  rating?: number;
  user_ratings_total?: number;
  formatted_phone_number?: string;
  website?: string;
  weekday_text?: string[];
  open_now?: boolean;
  url?: string;
}

interface RouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: "1", label: "Mua kem chống nắng", checked: true },
  { id: "2", label: "Đặt vé xe Thành Bưởi", checked: false },
  { id: "3", label: "Sạc dự phòng", checked: false },
  { id: "4", label: "Thuê xe máy tại Đà Lạt", checked: false },
];

  // Mock danh sách gợi ý khi tìm kiếm địa điểm để add vào hành trình
  const MOCK_SEARCH_RESULTS = [
    { id: "p-1", name: "Quán Đương - Cà phê thung lũng" },
    { id: "p-2", name: "Chợ Đêm Đà Lạt" },
    { id: "p-3", name: "Khu du lịch Langbiang" },
    { id: "p-4", name: "Lẩu Gà Lá É Tao Ngộ" },
  ];

const MAP_STYLES = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};
type MapStyleKey = keyof typeof MAP_STYLES;

export default function TripDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
  const trip = MOCK_TRIPS.find(t => t.id === id);
  const days = MOCK_ITINERARY_DAYS;

  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startY = useRef(0);

  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("default");
  const selectedMapStyle = MAP_STYLES[mapStyle];
  const is3D = mapStyle === "openstreetmap3d";

  const [activeTab, setActiveTab] = useState<ActiveTab>("itinerary");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [newTask, setNewTask] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [board, setBoard] = useState<DayColumn[]>([]);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: PlaceItem } | null>(null);
  const [formData, setFormData] = useState<Partial<PlaceItem>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [placeDetails, setPlaceDetails] = useState<OsmPlaceDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isExtraInfoExpanded, setIsExtraInfoExpanded] = useState(false);

  // ==================== OSRM ROUTING STATE ====================
  const [currentRoute, setCurrentRoute] = useState<RouteData | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  
  // State quản lý Drawer tuỳ chỉnh tuyến đường
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState(false);
  const [routeStartId, setRouteStartId] = useState<string>("current");
  const [routeWaypoints, setRouteWaypoints] = useState<string[]>([]);
  const [routeDestination, setRouteDestination] = useState<PlaceItem | null>(null);

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [is3D]);

  useEffect(() => {
    setIsMounted(true);
    if (days) {
      const initialBoard: DayColumn[] = days.map((d, dayIdx) => ({
        id: d.id || `day-${d.dayNumber}`,
        day: `Ngày ${d.dayNumber}`,
        date: formatDayOfWeek(d.date) || "Chưa chốt",
        items: d.locations.map((loc, locIdx) => ({
          id: loc.id,
          name: loc.name,
          time: loc.startTime || "",
          note: loc.address || "",
          cost: "",
          lat: 11.9404 + (dayIdx * 0.015) - (locIdx * 0.005),
          lng: 108.4583 + (dayIdx * 0.01) + (locIdx * 0.004),
          osmId: locIdx === 0 ? "W384074253" : undefined
        })),
      }));
      setBoard(initialBoard);

      setTimeout(() => {
        const allPoints: [number, number][] = [];
        initialBoard.forEach(col => col.items.forEach(item => {
          if (item.lng && item.lat) allPoints.push([item.lng, item.lat]);
        }));

        if (allPoints.length > 0 && mapRef.current) {
          const lngs = allPoints.map(p => p[0]);
          const lats = allPoints.map(p => p[1]);
          mapRef.current.fitBounds(
            [[Math.min(...lngs) - 0.01, Math.min(...lats) - 0.01], [Math.max(...lngs) + 0.01, Math.max(...lats) + 0.01]],
            { padding: 80, duration: 1500 }
          );
        }
      }, 800);
    }
  }, [days]);

  if (!isMounted) return <GlobalOverlayLoading isSolid={true} />;

  // Fetch OSM Place Details
  const fetchPlaceDetails = async (osmId: string) => {
    setIsLoadingDetails(true);
    setPlaceDetails(null);
    try {
      const res = await fetch(`/api/places?placeId=${osmId}`);
      if (!res.ok) throw new Error("Lỗi mạng");
      const data = await res.json();
      
      if (data && data.result) {
        setPlaceDetails({
          rating: data.result.rating,
          user_ratings_total: data.result.user_ratings_total,
          formatted_phone_number: data.result.formatted_phone_number,
          website: data.result.website,
          weekday_text: data.result.current_opening_hours?.weekday_text || data.result.opening_hours?.weekday_text,
          open_now: data.result.current_opening_hours?.open_now || data.result.opening_hours?.open_now,
          url: data.result.url
        });
      }
    } catch (error) {
      console.error("Lỗi fetch chi tiết", error);
      message.error("Không thể tải dữ liệu bản đồ.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSelectLocation = (dayId: string, item: PlaceItem) => {
    if (item.lng && item.lat && mapRef.current) {
      mapRef.current.easeTo({ center: [item.lng, item.lat], zoom: 16, duration: 1000 });
    }
    setEditingItem({ dayId, item });
    setFormData({ time: item.time || "", note: item.note || "", cost: item.cost || "" });
    setIsDetailOpen(true);

    if (item.osmId) {
      fetchPlaceDetails(item.osmId);
    } else {
      setPlaceDetails(null);
    }
  };

  // ==================== OSRM ROUTING ====================
  // Hàm này mở Drawer để cấu hình thay vì tính toán liền
  const handleOpenNavigation = (item: PlaceItem) => {
    setRouteDestination(item);
    setIsRouteDrawerOpen(true);
    setIsDetailOpen(false); // Tuỳ chọn: đóng menu chi tiết khi mở menu chỉ đường
  };

  // Tính toán lộ trình tuỳ chỉnh với điểm đi, điểm đến và điểm dừng
  const calculateCustomRoute = async () => {
    // 1. Xác định chính xác điểm đến
    const finalDestination = routeDestination || editingItem?.item;

    // Kiểm tra toạ độ điểm đến
    if (!finalDestination || !finalDestination.lat || !finalDestination.lng) {
      message.error("Điểm đến không có tọa độ!"); // Hoặc toast.error tuỳ thư viện bạn dùng
      return;
    }

    // Kiểm tra điểm bắt đầu
    if (!routeStartId) {
      message.warning("Vui lòng chọn điểm bắt đầu!");
      return;
    }

    setIsRouting(true);
    setCurrentRoute(null);

    // Thu thập tất cả địa điểm có tọa độ trên board
    const allAvailablePlaces = board.flatMap(col => col.items).filter(item => item.lat && item.lng);

    const getCoordsFromId = (id: string) => {
      if (id === "current") return { lat: 11.9404, lng: 108.4583 }; // Vị trí giả lập
      const place = allAvailablePlaces.find(p => p.id === id);
      return place ? { lat: place.lat, lng: place.lng } : null;
    };

    const startCoords = getCoordsFromId(routeStartId);
    
    // Gộp tất cả các tọa độ: Bắt đầu -> Các điểm dừng -> Kết thúc
    const routePoints = [
      startCoords,
      ...routeWaypoints.map(wpId => getCoordsFromId(wpId)),
      { lat: finalDestination.lat, lng: finalDestination.lng }
    ].filter(Boolean) as {lat: number, lng: number}[];

    if (routePoints.length < 2) {
      message.error("Cần ít nhất 2 điểm hợp lệ để tính lộ trình!");
      setIsRouting(false);
      return;
    }

    try {
      // OSRM Format: lon,lat;lon,lat;lon,lat
      const coordinatesString = routePoints.map(p => `${p.lng},${p.lat}`).join(';');
      
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (data.routes?.length > 0) {
        const route = data.routes[0];
        setCurrentRoute({
          coordinates: route.geometry.coordinates,
          duration: route.duration,
          distance: route.distance,
        });

        if (mapRef.current) {
          const lngs = routePoints.map(p => p.lng);
          const lats = routePoints.map(p => p.lat);
          mapRef.current.fitBounds(
            [
              [Math.min(...lngs) - 0.03, Math.min(...lats) - 0.03],
              [Math.max(...lngs) + 0.03, Math.max(...lats) + 0.03]
            ],
            { padding: 100, duration: 1200 }
          );
        }
        message.success(`Đã vẽ tuyến đường (${(route.distance/1000).toFixed(1)} km)`);
        setIsRouteDrawerOpen(false); // Vẽ xong thì đóng Drawer
      } else {
        message.warning("Không tìm thấy tuyến đường khả dụng.");
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tính tuyến đường");
    } finally {
      setIsRouting(false);
    }
  };

  const clearRoute = () => {
    setCurrentRoute(null);
    setRouteDestination(null);
    setRouteWaypoints([]);
    setRouteStartId("current");
  };

  // ==================== MARKERS (Đã sửa MarkerContent) ====================
  const renderMarkers = () => {
    return board.flatMap((dayCol) =>
      dayCol.items.map((item, index) => {
        if (!item.lng || !item.lat) return null;

        return (
          <MapMarker
            key={item.id}
            longitude={item.lng}
            latitude={item.lat}
            anchor="bottom"
          >
            {/* LƯU Ý: Đã bọc MarkerContent tại đây */}
            <MarkerContent>
              <div
                className="relative cursor-pointer select-none group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectLocation(dayCol.id, item);
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative transition-transform duration-200 group-hover:scale-110">
                    <EnvironmentFilled className="text-teal-600 text-4xl drop-shadow-lg" />
                    <span className="absolute text-white font-black text-[11px] top-[9px] left-1/2 -translate-x-1/2">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            </MarkerContent>
          </MapMarker>
        );
      })
    );
  };

  // ==================== DRAG & OTHER FUNCTIONS ====================
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditMode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startY.current = e.clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragOffset(e.clientY - startY.current);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    if (Math.abs(dragOffset) < 5) setIsExpanded(!isExpanded);
    else {
      if (isExpanded && dragOffset > 50) setIsExpanded(false);
      if (!isExpanded && dragOffset < -50) setIsExpanded(true);
    }
    setDragOffset(0);
  };

  const getSheetTransform = () => {
    if (isDragging) return isExpanded ? `translateY(${dragOffset}px)` : `translateY(calc(100% - 80px + ${dragOffset}px))`;
    return isExpanded ? `translateY(0)` : `translateY(calc(100% - 80px))`;
  };

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
    if (source.droppableId !== destination.droppableId) newBoard[destColIndex] = { ...destCol, items: destItems };

    setBoard(newBoard);
    message.success("Đã cập nhật thứ tự địa điểm!");
  };

  const handleAddDay = () => {
    const newDayNumber = board.length + 1;
    setBoard([...board, { id: `day-${newDayNumber}`, day: `Ngày ${newDayNumber}`, date: "Chưa chốt", items: [] }]);
    message.success(`Đã thêm Ngày ${newDayNumber}`);
  };

  const handleSelectPlace = (place: any) => {
    if (!activeDayId) return;
    const newPlace: PlaceItem = { 
      id: `item-${Date.now()}`, 
      name: place.name, 
      lat: place.lat, 
      lng: place.lng, 
      osmId: place.osmId 
    };
    setBoard((prev) => prev.map((col) => col.id === activeDayId ? { ...col, items: [...col.items, newPlace] } : col));
    setIsAddPlaceOpen(false);
    message.success(`Đã thêm ${place.name}`);
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
    message.success("Cập nhật thông tin thành công!");
  };

  const handleSaveAllItinerary = () => {
    setIsEditMode(false);
    message.success("Lịch trình mới đã được lưu!");
  };

  const handleOpenAddPlace = (dayId: string) => {
    setActiveDayId(dayId);
    setIsAddPlaceOpen(true);
  };

  const renderItineraryContent = () => {
    if (isEditMode) return <ItineraryBuilder board={board} onDragEnd={onDragEnd} handleSaveAllItinerary={handleSaveAllItinerary} handleAddDay={handleAddDay} onAddPlace={handleOpenAddPlace} onOpenPlaceDetail={handleSelectLocation} />;
    return <ItineraryContent board={board} setIsEditMode={setIsEditMode} onAddPlace={handleOpenAddPlace} onOpenPlaceDetail={handleSelectLocation} />;
  };



  // Tạo danh sách Dropdown cho Route Builder
  const allAvailablePlaces = board.flatMap(col => col.items).filter(item => item.lat && item.lng);
  const placeOptions = [
    { value: "current", label: "📍 Vị trí hiện tại của bạn" },
    ...allAvailablePlaces.map(p => ({ value: p.id, label: p.name }))
  ];

  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-gray-100">
      {/* MAP */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        <Map 
          ref={mapRef} 
          center={[108.4583, 11.9404]} 
          zoom={13}
          styles={selectedMapStyle ? { light: selectedMapStyle, dark: selectedMapStyle } : undefined}
        >
          {renderMarkers()}

          {currentRoute && (
            <MapRoute
              coordinates={currentRoute.coordinates}
              color="#14b8a6"
              width={6}
              opacity={0.95}
            />
          )}
        </Map>

        {/* Map Style Selector */}
        <div className="absolute top-20 right-4 z-10">
          <select 
            value={mapStyle} 
            onChange={(e) => setMapStyle(e.target.value as MapStyleKey)} 
            className="bg-white/95 backdrop-blur-md text-gray-800 rounded-lg border border-gray-100 px-3 py-2 text-sm font-medium shadow-sm"
          >
            <option value="default">Default</option>
            <option value="openstreetmap">OpenStreetMap</option>
            <option value="openstreetmap3d">OpenStreetMap 3D</option>
          </select>
        </div>

        {/* Clear Route Button */}
        {currentRoute && (
          <Button 
            onClick={clearRoute}
            className="absolute top-32 right-4 z-10 bg-white shadow-md hover:bg-red-50 text-red-600"
            danger
          >
            Xóa tuyến đường
          </Button>
        )}
      </div>

      {/* Topbar */}
      <div className="absolute top-0 left-0 right-0 z-[200] flex items-center justify-between px-4 pt-4 pb-3 pointer-events-none">
        <Link href={APP_ROUTES.MAIN.TRIPS} className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-sm hover:bg-white border border-gray-100">
          <ArrowLeftOutlined className="text-gray-700" />
          <span className="font-bold text-gray-900 truncate max-w-[150px] text-sm">{trip?.name}</span>
        </Link>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white border border-gray-100">
            <SearchOutlined className="text-gray-700" />
          </button>
          <button className="hidden md:flex w-10 h-10 bg-white/95 backdrop-blur-md rounded-full items-center justify-center shadow-sm hover:bg-white border border-gray-100">
            <EllipsisOutlined className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className="hidden md:block absolute inset-0 z-10 pointer-events-none mt-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-white shadow-[4px_0_24px_rgba(0,0,0,0.06)] border border-gray-100 border-l-0 px-1.5 py-6 rounded-r-2xl transition-all duration-500 ${sidebarOpen ? "left-[415px]" : "left-[15px]"}`}
        >
          {sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </button>

        <aside className={`absolute -top-[15px] bottom-[90px] left-[15px] w-[400px] bg-white rounded-3xl shadow-2xl z-20 flex flex-col overflow-hidden pointer-events-auto transition-transform duration-500 ${sidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+30px)]"}`}>
          <div className="px-6 pt-5 pb-4 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag color="cyan" className="rounded-full border-0 bg-cyan-50 text-cyan-600"><CalendarOutlined /> {board.length} ngày</Tag>
              <Tag color="green" className="rounded-full border-0 bg-green-50 text-green-600"><DownloadOutlined /> {board.reduce((s, d) => s + d.items.length, 0)} điểm</Tag>
            </div>
          </div>
          <div className="px-6 pt-4 shrink-0">
            {renderGridMenu()}
            <div className="flex bg-gray-100/80 p-1 rounded-2xl mb-4">
              {(["itinerary", "checklist"] as const).map((t) => (
                <button key={t} disabled={isEditMode && t === "checklist"} onClick={() => setActiveTab(t)} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === t ? "bg-white shadow-sm text-teal-600" : "text-gray-500 hover:text-gray-700"}`}>
                  {t === "itinerary" ? "Lịch trình" : "Checklist"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-2 pb-6">
            {activeTab === "itinerary" ? renderItineraryContent() : <ChecklistContent checklistItems={checklistItems} toggleCheck={(id) => setChecklistItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it))} newTask={newTask} setNewTask={setNewTask} addTask={() => { if(newTask.trim()) { setChecklistItems(prev => [...prev, { id: Date.now().toString(), label: newTask.trim(), checked: false }]); setNewTask(""); } }} />}
          </div>
        </aside>
      </div>

      {/* ── MOBILE BOTTOM SHEET (MAIN) ── */}
      <div
        className="md:hidden absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-4xl shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col h-[80%] will-change-transform"
        style={{ transform: getSheetTransform(), transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <div
          className="h-20 shrink-0 flex flex-col justify-center px-6 cursor-grab active:cursor-grabbing border-b border-gray-50 bg-white rounded-t-4xl select-none touch-none"
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
        >
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <span className="font-bold text-gray-900 text-base truncate block">{trip?.name}</span>
              <p className="text-[11px] text-gray-500 mt-1"><CalendarOutlined /> {board.length} ngày</p>
            </div>
            <div className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full text-[11px] font-bold">{board.reduce((s, d) => s + d.items.length, 0)} điểm</div>
          </div>
        </div>
        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity duration-300 delay-100 ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="px-6 pt-4 pb-2 shrink-0 bg-white">
            {renderGridMenu()}
            <div className="flex bg-gray-100/80 p-1 rounded-xl mb-2">
              <button onClick={() => setActiveTab("itinerary")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === "itinerary" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"}`}>Lịch trình</button>
              <button onClick={() => setActiveTab("checklist")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${activeTab === "checklist" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500"}`}>Checklist</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {activeTab === "itinerary" ? renderItineraryContent() : <div>Checklist Mobile Content</div>}
          </div>
        </div>
      </div>

      {/* ── DESKTOP DRAWER CHI TIẾT ── */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && (
        <Drawer
          title={<span className="font-bold text-lg text-gray-800">Cập nhật hoạt động</span>}
          placement="right" width={420} onClose={() => setIsDetailOpen(false)} open={isDetailOpen}
          styles={{ body: { padding: 0, backgroundColor: "#f9fafb" }, header: { padding: "16px" } }} className="md:rounded-l-2xl"
        >
          {editingItem && (
            <TripDetailContent
              editingItem={editingItem}
              board={board}
              isLoadingDetails={isLoadingDetails}
              placeDetails={placeDetails}
              routeStartId={routeStartId}
              setRouteStartId={setRouteStartId}
              routeWaypoints={routeWaypoints}
              setRouteWaypoints={setRouteWaypoints}
              routeDestination={routeDestination}
              calculateCustomRoute={calculateCustomRoute}
              isRouting={isRouting}
              isExtraInfoExpanded={isExtraInfoExpanded}
              setIsExtraInfoExpanded={setIsExtraInfoExpanded}
              formData={formData}
              setFormData={setFormData}
              handleSaveDetail={handleSaveDetail}
              placeOptions={placeOptions}
            />
          )}
        </Drawer>
      )}

      {/* ── MOBILE BOTTOM SHEET CHI TIẾT ── */}
      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <MobileBottomSheet open={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Cập nhật hoạt động" defaultVh={70} maxVh={90}>
          {editingItem && (
            <div className="pb-8">
              <TripDetailContent
                editingItem={editingItem}
                board={board}
                isLoadingDetails={isLoadingDetails}
                placeDetails={placeDetails}
                routeStartId={routeStartId}
                setRouteStartId={setRouteStartId}
                routeWaypoints={routeWaypoints}
                setRouteWaypoints={setRouteWaypoints}
                routeDestination={routeDestination}
                calculateCustomRoute={calculateCustomRoute}
                isRouting={isRouting}
                isExtraInfoExpanded={isExtraInfoExpanded}
                setIsExtraInfoExpanded={setIsExtraInfoExpanded}
                formData={formData}
                setFormData={setFormData}
                handleSaveDetail={handleSaveDetail}
                placeOptions={placeOptions}
              />
              <div className="px-5 flex gap-3">
                <Button onClick={() => handleOpenNavigation(editingItem.item)} className="flex-1 rounded-xl h-11 border-teal-500 text-teal-600 font-bold">Chỉ đường Map</Button>
              </div>
            </div>
          )}
        </MobileBottomSheet>
      )}

      {/* ── NÚT KHÁM PHÁ (MOBILE) ── */}
      <div className="md:hidden fixed bottom-6 right-6 z-30">
        <button 
          onClick={() => setIsAddPlaceOpen(true)} 
          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg font-bold text-base flex items-center gap-2"
        >
          <Plus size={18} /> Thêm địa điểm
        </button>
      </div>

      {/* ── DESKTOP & MOBILE ADD PLACE ── */}
      {typeof window !== "undefined" && window.innerWidth >= 768 && (
        <Drawer title={<span className="font-bold text-base">Khám phá & Thêm địa điểm</span>} placement="right" width={480} onClose={() => setIsAddPlaceOpen(false)} open={isAddPlaceOpen} styles={{ body: { padding: "12px", backgroundColor: "#f9fafb" } }} className="rounded-3xl">
          <div className="space-y-4">
            <Input size="large" placeholder="Tìm kiếm địa danh..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} prefix={<Search className="text-gray-400 mr-1" size={16} />} className="rounded-xl border-gray-200" />
            <div className="space-y-2">
              {MOCK_SEARCH_RESULTS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((place) => (
                <div key={place.id} onClick={() => handleSelectPlace(place)} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-teal-500 transition-all">
                  <div className="flex items-center gap-2.5"><EnvironmentOutlined className="text-teal-600" /><span className="text-xs font-bold text-gray-800">{place.name}</span></div><Plus size={14} className="text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </Drawer>
      )}

      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <MobileBottomSheet open={isAddPlaceOpen} onClose={() => setIsAddPlaceOpen(false)} title="Khám phá" defaultVh={75} maxVh={90}>
          <div className="space-y-4 p-4">
            <Input size="large" placeholder="Tìm kiếm địa danh..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} prefix={<Search className="text-gray-400 mr-1" size={16} />} className="rounded-xl border-gray-200" />
            <div className="space-y-2">
              {MOCK_SEARCH_RESULTS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((place) => (
                <div key={place.id} onClick={() => handleSelectPlace(place)} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2.5"><EnvironmentOutlined className="text-teal-600" /><span className="text-xs font-bold text-gray-800">{place.name}</span></div><Plus size={14} className="text-teal-600" />
                </div>
              ))}
            </div>
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}