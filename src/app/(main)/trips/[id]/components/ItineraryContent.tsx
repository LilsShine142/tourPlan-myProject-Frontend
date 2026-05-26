import React from "react";
import LocationCard from "./LocationCard";
import { PlusOutlined } from "@ant-design/icons";

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

interface ItineraryContentProps {
  board: DayColumn[];
  setIsEditMode: (v: boolean) => void;
  onAddPlace: (dayId: string) => void;
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({ board, setIsEditMode, onAddPlace }) => (
  <div className="space-y-6">
    {board.map((day, idx) => (
      <div key={day.id}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
            {idx + 1}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">{day.day}</p>
            <p className="text-xs text-gray-500">{day.items.length} địa điểm</p>
          </div>
          <button
            className="w-8 h-8 rounded-xl bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition-colors"
            title="Thêm địa điểm cho ngày này"
            onClick={() => onAddPlace(day.id)}
          >
            <PlusOutlined />
          </button>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-dashed border-teal-600/20 space-y-4">
          {day.items.map((loc) => <LocationCard key={loc.id} loc={loc} />)}
        </div>
      </div>
    ))}
    <button 
      onClick={() => setIsEditMode(true)}
      className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50/30 transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2"
    >
      <PlusOutlined /> Thêm lịch trình / Sắp xếp địa điểm
    </button>
  </div>
);

export default ItineraryContent;
