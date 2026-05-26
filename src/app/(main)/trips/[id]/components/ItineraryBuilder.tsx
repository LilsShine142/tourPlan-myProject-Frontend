import React from "react";
import { Button } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { Plus, Clock, GripHorizontal } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

interface ItineraryBuilderProps {
  board: DayColumn[];
  onDragEnd: (result: DropResult) => void;
  handleSaveAllItinerary: () => void;
  handleAddDay: () => void;
  onAddPlace: (dayId: string) => void;
  onOpenPlaceDetail: (dayId: string, item: PlaceItem) => void;
}

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ board, onDragEnd, handleSaveAllItinerary, handleAddDay, onAddPlace, onOpenPlaceDetail }) => (
  <div className="space-y-4 pb-12">
    <div className="flex items-center justify-between bg-teal-50 p-3 rounded-2xl border border-teal-100">
      <span className="text-xs font-bold text-teal-700"><EditOutlined /> CHẾ ĐỘ SẮP XẾP LỊCH TRÌNH</span>
      <Button 
        type="primary" 
        size="small" 
        icon={<CheckOutlined />} 
        className="bg-teal-600 rounded-lg text-xs"
        onClick={handleSaveAllItinerary}
      >
        Lưu lại
      </Button>
    </div>
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-5">
        {board.map((col) => (
          <div key={col.id} className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80 flex flex-col max-h-[50vh]">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="font-bold text-gray-900">{col.day}</span>
              <span className="text-xs text-gray-500">{col.items.length} địa điểm</span>
              <button
                className="w-8 h-8 rounded-xl bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition-colors ml-2"
                title="Thêm địa điểm cho ngày này"
                onClick={() => onAddPlace(col.id)}
              >
                <Plus size={16} />
              </button>
            </div>
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 min-h-[40px]">
                  {col.items.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white rounded-xl p-2 shadow border border-gray-100 flex items-center ${snapshot.isDragging ? 'border-teal-500' : ''}`}
                          onClick={() => {
                            if (window.innerWidth < 768) onOpenPlaceDetail(col.id, item);
                          }}
                          onDoubleClick={() => {
                            if (window.innerWidth >= 768) onOpenPlaceDetail(col.id, item);
                          }}
                        >
                          <span
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing px-2 text-gray-400"
                            title="Kéo để sắp xếp"
                          >
                            <GripHorizontal size={20} />
                          </span>
                          <span className="font-medium text-gray-700 flex-1">
                            {item.name}
                            <span className="block text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <Clock size={12} className="inline-block" />
                              {item.time ? item.time : 'Chưa chốt giờ'}
                            </span>
                          </span>
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
        <div onClick={handleAddDay} className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all group h-[80px]">
          <div className="text-center flex items-center gap-2">
            <Plus size={16} strokeWidth={2.5} className="text-gray-400 group-hover:text-teal-600" />
            <p className="font-bold text-xs text-gray-500 group-hover:text-teal-600">Thêm ngày mới</p>
          </div>
        </div>
      </div>
    </DragDropContext>
  </div>
);

export default ItineraryBuilder;
