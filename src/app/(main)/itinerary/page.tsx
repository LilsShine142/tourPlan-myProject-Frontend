'use client';
import { Button } from 'antd';
import { Plus, GripHorizontal, MapPin } from 'lucide-react';

const MOCK_BOARD = [
  {
    day: "Ngày 1",
    date: "12/04",
    items: ["Chợ Đà Lạt", "Ga Đà Lạt", "Quảng trường Lâm Viên"]
  },
  {
    day: "Ngày 2",
    date: "13/04",
    items: ["Đồi Chè Cầu Đất", "Chùa Linh Phước"]
  }
];

export default function ItineraryBuilderPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Sắp xếp lịch trình</h1>
          <p className="text-gray-500 font-medium mt-1">Kéo thả để sắp xếp các địa điểm</p>
        </div>
        <Button type="primary" className="bg-teal-500 h-10 px-6 rounded-full font-semibold shadow-md">
          Lưu lịch trình
        </Button>
      </div>

      {/* Kanban Board Layout cho Desktop / Stack cho Mobile */}
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-8 snap-x">
        {MOCK_BOARD.map((col, idx) => (
          <div key={idx} className="min-w-[300px] md:w-[350px] bg-gray-100/50 rounded-3xl p-4 border border-gray-200/60 shrink-0 snap-center">
            <div className="flex justify-between items-center mb-4 px-2">
              <div>
                <h3 className="font-bold text-gray-800">{col.day}</h3>
                <p className="text-xs text-gray-500 font-medium">{col.date}</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-teal-600 hover:bg-teal-50">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {col.items.map((item, i) => (
                <div 
                  key={i} 
                  className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex items-center gap-3"
                >
                  <GripHorizontal size={20} className="text-gray-300 group-hover:text-teal-500 transition-colors" />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{item}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> Chưa có giờ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Nút thêm cột */}
        <div className="min-w-[300px] md:w-[350px] border-2 border-dashed border-gray-300 rounded-3xl p-4 flex items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all group shrink-0">
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-200 group-hover:bg-teal-100 text-gray-500 group-hover:text-teal-600 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
              <Plus size={20} />
            </div>
            <p className="font-semibold text-gray-500 group-hover:text-teal-600">Thêm ngày mới</p>
          </div>
        </div>
      </div>
    </div>
  );
}