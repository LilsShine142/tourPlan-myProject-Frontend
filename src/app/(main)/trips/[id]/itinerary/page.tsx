"use client";

import React, { useState, useEffect } from "react";
import { Button, Drawer, Input, Tag } from "antd";
import { 
  Plus, GripHorizontal, MapPin, Clock, Search, Navigation, 
  AlignLeft, DollarSign, Calendar
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useParams } from "next/navigation";

// --- TYPES & MOCK DATA ---
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

const INITIAL_BOARD: DayColumn[] = [
  {
    id: "day-1",
    day: "Ngày 1",
    date: "12/04",
    items: [
      { id: "item-1", name: "Chợ Đà Lạt", time: "19:00", note: "Ăn bánh tráng nướng, uống sữa đậu nành", cost: "150.000đ" },
      { id: "item-2", name: "Ga Đà Lạt", time: "14:00" },
      { id: "item-3", name: "Quảng trường Lâm Viên" },
    ],
  },
  {
    id: "day-2",
    day: "Ngày 2",
    date: "13/04",
    items: [
      { id: "item-4", name: "Đồi Chè Cầu Đất", time: "08:00" },
      { id: "item-5", name: "Chùa Linh Phước" },
    ],
  },
];

const MOCK_SEARCH_RESULTS = [
  { id: "p1", name: "Hồ Xuân Hương", address: "Phường 1, Đà Lạt", type: "Thắng cảnh" },
  { id: "p2", name: "Làng Cù Lần", address: "Xã Lát, Lạc Dương", type: "Du lịch sinh thái" },
  { id: "p3", name: "Tiệm Cafe Túi Mơ To", address: "Phường 11, Đà Lạt", type: "Quán Cafe" },
];

export default function ItineraryBuilderPage() {
  // Lấy id từ URL (ví dụ: /trips/trip-001/itinerary -> params.id sẽ là "trip-001")
  const params = useParams();
  const tripId = params.id;
  const [mounted, setMounted] = useState(false);
  const [board, setBoard] = useState<DayColumn[]>(INITIAL_BOARD);
  
  // State: Modal Thêm địa điểm mới
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);

  // State: Drawer Chi tiết & Cập nhật địa điểm
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ dayId: string; item: PlaceItem } | null>(null);
  const [formData, setFormData] = useState<Partial<PlaceItem>>({});

  useEffect(() => {
    setMounted(true);
    // Bạn có thể dùng tripId ở đây để fetch data lịch trình từ database
    console.log("Đang sửa lịch trình cho chuyến đi có ID:", tripId);
  }, [tripId]);

  // --- LOGIC: KÉO THẢ ---
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
  };

  const handleAddDay = () => {
    const newDayNumber = board.length + 1;
    setBoard([...board, {
      id: `day-${newDayNumber}`,
      day: `Ngày ${newDayNumber}`,
      date: "Chưa chốt",
      items: [],
    }]);
  };

  const handleSelectPlace = (place: any) => {
    if (!activeDayId) return;
    const newPlace: PlaceItem = { id: `item-${Date.now()}`, name: place.name };
    setBoard((prev) => prev.map((col) => col.id === activeDayId ? { ...col, items: [...col.items, newPlace] } : col));
    setIsAddPlaceOpen(false);
  };

  // --- LOGIC: MỞ CHI TIẾT ĐỊA ĐIỂM ---
  const openPlaceDetail = (dayId: string, item: PlaceItem) => {
    setEditingItem({ dayId, item });
    setFormData({ time: item.time || "", note: item.note || "", cost: item.cost || "" });
    setIsDetailOpen(true);
  };

  // --- LOGIC: LƯU CẬP NHẬT ĐỊA ĐIỂM ---
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
  };

  // Ví dụ ở nút Lưu, bạn có thể truyền tripId vào API:
  // const handleSave = () => {
  //    saveItineraryToDB(tripId, board);
  // }

  if (!mounted) return <div className="min-h-screen bg-gray-50/50" />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Sắp xếp lịch trình</h1>
          <p className="text-gray-500 font-medium mt-1">Kéo thả để sắp xếp, chạm/click đúp để xem chi tiết</p>
        </div>
        <Button type="primary" className="bg-teal-600 hover:bg-teal-500 h-11 px-8 rounded-2xl font-bold shadow-md shadow-teal-500/20">
          Lưu lịch trình
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 snap-x select-none">
          {board.map((col) => (
            <div key={col.id} className="min-w-[300px] md:w-[350px] bg-gray-100/60 rounded-[24px] p-4 border border-gray-200/60 shrink-0 snap-center flex flex-col max-h-[75vh]">
              <div className="flex justify-between items-center mb-4 px-2 shrink-0">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{col.day}</h3>
                  <p className="text-xs text-gray-500 font-medium">{col.date}</p>
                </div>
                <button 
                  onClick={() => { setActiveDayId(col.id); setIsAddPlaceOpen(true); }}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm text-teal-600 hover:bg-teal-50 hover:scale-105 transition-all"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 flex-1 overflow-y-auto p-1 rounded-2xl transition-colors ${snapshot.isDraggingOver ? "bg-teal-50/50" : ""}`}
                  >
                    {col.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            // BẮT SỰ KIỆN CLICK THEO DEVICE
                            onClick={() => {
                              if (window.innerWidth < 768) openPlaceDetail(col.id, item);
                            }}
                            onDoubleClick={() => {
                              if (window.innerWidth >= 768) openPlaceDetail(col.id, item);
                            }}
                            className={`group bg-white p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                              snapshot.isDragging
                                ? "shadow-xl border-teal-500 scale-[1.02] rotate-1 z-50"
                                : "shadow-sm border-gray-100 hover:border-teal-300 hover:shadow-md"
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="touch-none py-2 cursor-grab active:cursor-grabbing">
                              <GripHorizontal size={20} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                                {item.time ? (
                                  <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">
                                    <Clock size={10} /> {item.time}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1"><MapPin size={10} /> Chưa chốt giờ</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          <div onClick={handleAddDay} className="min-w-[300px] md:w-[350px] border-2 border-dashed border-gray-300 rounded-[24px] p-4 flex items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all group shrink-0 h-[200px]">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 group-hover:bg-teal-100 text-gray-500 group-hover:text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors shadow-sm">
                <Plus size={24} strokeWidth={2.5} />
              </div>
              <p className="font-bold text-gray-500 group-hover:text-teal-600">Thêm ngày mới</p>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* --- DRAWER CHI TIẾT & CẬP NHẬT ĐỊA ĐIỂM --- */}
      <Drawer
        title={<span className="font-bold text-lg text-gray-800">Cập nhật hoạt động</span>}
        placement={window.innerWidth < 768 ? "bottom" : "right"}
        width={window.innerWidth >= 768 ? 450 : "100%"}
        height={window.innerWidth < 768 ? "85vh" : "100%"}
        onClose={() => setIsDetailOpen(false)}
        open={isDetailOpen}
        classNames={{ body: "p-0 bg-gray-50", header: "border-b border-gray-100 py-4 bg-white" }}
        className="md:rounded-l-2xl rounded-t-3xl md:rounded-tr-none"
        extra={
          <Button type="primary" onClick={handleSaveDetail} className="bg-teal-600 rounded-xl font-semibold">
            Lưu
          </Button>
        }
      >
        {editingItem && (
          <div className="p-6 space-y-6">
            {/* Tên địa điểm */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900">{editingItem.item.name}</h3>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                  <Calendar size={14} /> Thuộc {board.find(c => c.id === editingItem.dayId)?.day}
                </p>
              </div>
            </div>

            {/* Các trường thông tin nhập liệu */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Thời gian dự kiến</label>
                <Input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  size="large"
                  prefix={<Clock size={18} className="text-gray-400 mr-2" />}
                  className="rounded-2xl border-gray-200 h-12 shadow-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Chi phí dự kiến</label>
                <Input 
                  placeholder="Vd: 150.000đ, Miễn phí..."
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  size="large"
                  prefix={<DollarSign size={18} className="text-gray-400 mr-2" />}
                  className="rounded-2xl border-gray-200 h-12 shadow-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Ghi chú & Dặn dò</label>
                <Input.TextArea 
                  placeholder="Nhập ghi chú cho địa điểm này (vd: Nhớ mặc áo lạnh, ăn quán đối diện...)"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  className="rounded-2xl border-gray-200 shadow-sm p-4 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* --- DRAWER TÌM KIẾM ĐỊA ĐIỂM --- */}
      <Drawer
        title={<span className="font-bold text-lg">Khám phá địa điểm</span>}
        placement="bottom"
        height="85vh"
        onClose={() => setIsAddPlaceOpen(false)}
        open={isAddPlaceOpen}
        classNames={{ body: "p-0", header: "border-b border-gray-100 py-4" }}
        className="rounded-t-[24px] md:rounded-xl md:!w-[500px] md:!m-auto md:!h-[600px]"
      >
        <div className="p-4 flex flex-col h-full bg-gray-50/50">
          <Input size="large" placeholder="Tìm kiếm địa danh, quán ăn..." prefix={<Search className="text-gray-400 mr-2" size={18} />} className="rounded-2xl border-gray-200 shadow-sm mb-4 bg-white" />
          <div className="flex-1 overflow-y-auto">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Gợi ý gần đây</p>
            <div className="space-y-3">
              {MOCK_SEARCH_RESULTS.map((place) => (
                <div key={place.id} onClick={() => handleSelectPlace(place)} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-teal-400 active:scale-[0.98] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><MapPin size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{place.name}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{place.address}</p>
                    <Tag className="mt-2 rounded-full border-0 bg-gray-100 text-gray-600 text-[10px] px-2 font-medium">{place.type}</Tag>
                  </div>
                  <Navigation size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
