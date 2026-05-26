import React from "react";

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}
import { PlusOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons";

interface ChecklistContentProps {
  checklistItems: ChecklistItem[];
  toggleCheck: (id: string) => void;
  newTask: string;
  setNewTask: (v: string) => void;
  addTask: () => void;
}

const ChecklistContent: React.FC<ChecklistContentProps> = ({ checklistItems, toggleCheck, newTask, setNewTask, addTask }) => (
  <div className="flex flex-col h-full min-h-0">
    {checklistItems.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
          <CloseOutlined className="text-3xl text-orange-400" />
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
                item.checked ? "bg-teal-600 border-teal-600" : "border-gray-300 bg-white"
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
        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-teal-600 hover:text-white disabled:opacity-40 flex items-center justify-center transition-all duration-200 shrink-0"
      >
        <SendOutlined style={{ fontSize: 13 }} />
      </button>
    </div>
  </div>
);

export default ChecklistContent;
