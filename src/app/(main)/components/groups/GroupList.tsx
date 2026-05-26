"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar } from "antd";
import { 
  BellOutlined, PlusOutlined, ArrowDownOutlined, ArrowUpOutlined, CompassOutlined, FileTextOutlined
} from "@ant-design/icons";
import CreateGroupModal from "./CreateGroupModal";

// 1. Tách biệt hoàn toàn Fake Data ra khỏi cấu trúc UI
const MOCK_GROUPS = [
  {
    id: "group-1",
    name: "Đà Lạt Mộng Mơ",
    category: "Du lịch",
    currency: "VND",
    balance: 50000, // Dương là nhận, âm là nợ
    status: "receive", 
    members: [
      { id: "m1", name: "Tuấn", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" },
      { id: "m2", name: "Hải", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" },
      { id: "m3", name: "Thành", textFallback: "T" },
    ]
  },
  {
    id: "group-2",
    name: "Ăn Trưa Văn Phòng",
    category: "Ăn uống",
    currency: "VND",
    balance: -120000, 
    status: "pay",
    members: [
      { id: "m4", name: "Linh", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Linh" },
      { id: "m1", name: "Tuấn", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" },
    ]
  }
];

export default function GroupList() {
  const params = useParams();
  const currentGroupId = params?.id as string; // Lấy ID nhóm từ URL hiện tại

  // 2. Khởi tạo State kèm dữ liệu mặc định để tránh lỗi undefined
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Hàm nhận dữ liệu từ Modal và thêm vào danh sách
  const handleCreateGroup = (newGroup: any) => {
    // Chuẩn hóa dữ liệu map với cấu trúc item để không bị lỗi UI khi render nhóm mới
    const formattedGroup = {
      id: newGroup.id,
      name: newGroup.name,
      category: "Chưa phân loại",
      currency: "VND",
      balance: 0,
      status: "none",
      members: [{ id: "me", name: "Bạn", textFallback: "B" }]
    };
    setGroups([formattedGroup, ...groups]); // Thêm nhóm mới lên đầu
  };

  // Lọc danh sách theo từ khóa tìm kiếm công thức an toàn
  const filteredGroups = groups.filter(g => 
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán nhanh số liệu Tổng quan (Summary) dựa trên mảng data thực tế
  const totalReceived = groups.filter(g => g.balance > 0).reduce((sum, g) => sum + g.balance, 0);
  const totalPaid = Math.abs(groups.filter(g => g.balance < 0).reduce((sum, g) => sum + g.balance, 0));

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 lg:px-0 lg:pt-0 pb-24 lg:pb-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nhóm chi tiêu</h1>
        <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
          <BellOutlined className="text-lg text-gray-600" />
        </button>
      </div>

      {/* Thẻ Summary (Dữ liệu tự động tính theo state groups) */}
      <div className="bg-gradient-to-br from-[#0B635D] to-[#063B37] rounded-[32px] p-6 text-white shadow-2xl shadow-teal-900/20 relative overflow-hidden group">
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-xl group-hover:bg-teal-400/30 transition-colors duration-700"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <p className="text-teal-100/70 text-[11px] font-bold tracking-widest uppercase mb-1.5">Tổng quan</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{groups.length}</span>
              <span className="text-teal-50 text-base font-medium opacity-90">nhóm</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-sm">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <ArrowDownOutlined className="text-emerald-400 text-[10px]" />
              </div>
              <span className="text-xs font-bold text-emerald-50">Dư {totalReceived.toLocaleString()}đ</span>
            </div>
            <div className={`bg-rose-500/20 border border-rose-400/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 backdrop-blur-md shadow-sm ${totalPaid === 0 ? 'opacity-40' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-rose-400/20 flex items-center justify-center">
                <ArrowUpOutlined className="text-rose-400 text-[10px]" />
              </div>
              <span className="text-xs font-bold text-rose-50">Nợ {totalPaid.toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tìm kiếm nhóm (Bạn có thể bỏ ẩn thanh này nếu cần dùng) */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Tìm nhanh nhóm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Danh sách Item (Render Động bằng Vòng lặp .map) */}
      <div className="space-y-3 overflow-y-auto no-scrollbar pb-20 lg:pb-0 flex-1">
        {filteredGroups.map((group) => {
          const isSelected = currentGroupId === group.id;
          const isReceive = group.balance >= 0;

          return (
            <Link href={`/groups/${group.id}`} key={group.id} className="block">
              <div className={`rounded-[28px] p-4 flex items-center gap-4 transition-all duration-300 active:scale-[0.98] ${
                isSelected 
                  ? "bg-teal-50 border-2 border-teal-500 shadow-md" 
                  : "bg-white border-2 border-transparent shadow-sm hover:border-teal-100 hover:shadow-md"
              }`}>
                {/* Icon đại diện nhóm */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-3xl shadow-inner relative overflow-hidden shrink-0">
                  <CompassOutlined />
                  <div className="absolute bottom-1 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 rounded-full uppercase border border-white/30">
                    {group.currency}
                  </div>
                </div>
                
                {/* Nội dung thông tin nhóm */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{group.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-100/80 w-max px-2 py-0.5 rounded-md mb-2">
                    <FileTextOutlined /> {group.category}
                  </div>
                  
                  {/* Danh sách thành viên */}
                  <Avatar.Group size="small" max={{ count: 3 }} className="opacity-90">
                    {group.members.map((member) => (
                      <Avatar 
                        key={member.id} 
                        src={member.avatar || undefined} 
                        style={!member.avatar ? { backgroundColor: '#f56a00' } : undefined}
                      >
                        {!member.avatar && member.textFallback}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>

                {/* Biến động số dư tiền nông */}
                <div className="text-right shrink-0">
                  <p className={`font-bold text-base ${isReceive ? "text-emerald-500" : "text-rose-500"}`}>
                    {isReceive ? `+${group.balance.toLocaleString()}` : `${group.balance.toLocaleString()}`}đ
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                    {isReceive ? "Nhận" : "Cần Trả"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {/* 3. Đã bổ sung onClick mở Modal tại đây */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="border-2 border-dashed border-teal-200/60 bg-teal-50/30 rounded-[28px] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-all active:scale-[0.98] group mt-3"
        >
          <div className="w-12 h-12 bg-white text-teal-600 rounded-full flex items-center justify-center text-xl shadow-sm mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <PlusOutlined />
          </div>
          <h3 className="text-teal-800 font-bold text-base">Tạo Nhóm Mới</h3>
        </div>

        {/* Gọi component Modal */}
        <CreateGroupModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateGroup}
        />
      </div>
    </div>
  );
}