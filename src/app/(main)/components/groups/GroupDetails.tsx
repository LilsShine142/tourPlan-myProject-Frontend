"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Avatar, Dropdown, MenuProps, message, Modal, Spin } from "antd";
import { 
  PlusOutlined, SearchOutlined, EllipsisOutlined, FileTextOutlined,
  LeftOutlined, SwapOutlined, BarChartOutlined, TeamOutlined, 
  CompassOutlined, CheckCircleFilled, ExclamationCircleFilled,
  FilePdfOutlined, ShareAltOutlined, PictureOutlined, EditOutlined, DeleteOutlined, CopyOutlined
} from "@ant-design/icons";

// Các components con
import GroupStats from "./GroupStats";
import GroupSettle from "./GroupSettle";
import GroupAddBill from "./GroupAddBill";
import GroupMembers from "./GroupMembers";
import GroupEdit from "./GroupEdit";
import TripSummaryExport from "./TripSummaryExport";

// 1. DATABASE MOCK: Giả lập dữ liệu chi tiết của từng nhóm trả về từ Server
const MOCK_GROUPS_DATABASE: Record<string, any> = {
  "group-1": {
    id: "group-1",
    name: "Đà Lạt Mộng Mơ",
    category: "Du lịch",
    currency: "đ",
    totalExpense: 2450000,
    userBalance: 50000, // Dương: Được nhận tiền
    members: [
      { id: "m1", name: "Tuấn", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" },
      { id: "m2", name: "Hải", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Hải" },
      { id: "m3", name: "Thành", textFallback: "T" },
    ],
    bills: [
      { id: "b1", title: "Lẩu gà lá é", icon: "🍜", payer: "Quang Hải", amount: 450000, date: "Hôm nay" },
      { id: "b2", title: "Vé homestay 3 đêm", icon: "🏡", payer: "Bạn", amount: 1500000, date: "Hôm qua" },
      { id: "b3", title: "Cà phê phân chồn", icon: "☕", payer: "Tuấn Anh", amount: 500000, date: "2 ngày trước" },
    ]
  },
  "group-2": {
    id: "group-2",
    name: "Ăn Trưa Văn Phòng",
    category: "Ăn uống",
    currency: "đ",
    totalExpense: 890000,
    userBalance: -120000, // Âm: Đang nợ nhóm
    members: [
      { id: "m4", name: "Linh", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Linh" },
      { id: "m1", name: "Tuấn", avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" },
    ],
    bills: [
      { id: "b4", title: "Cơm tấm bãi rác", icon: "🍛", payer: "Mỹ Linh", amount: 240000, date: "Hôm nay" },
      { id: "b5", title: "Trà sữa Koi Thé", icon: "🧋", payer: "Bạn", amount: 650000, date: "Hôm qua" },
    ]
  }
};

interface GroupDetailsProps {
  groupId: string;
}

export default function GroupDetails({ groupId }: GroupDetailsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bills" | "stats" | "settle" | "add_bill" | "members" | "edit">("bills");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Các State quản lý dữ liệu động
  const [groupData, setGroupData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. EFFECT: Giả lập một luồng Call API bất đồng bộ theo ID nhóm
  useEffect(() => {
    setIsLoading(true);
    
    // Giả lập thời gian delay mạng 0.6 giây
    const apiTimer = setTimeout(() => {
      const dataFromServer = MOCK_GROUPS_DATABASE[groupId];
      
      if (dataFromServer) {
        setGroupData(dataFromServer);
      } else {
        // Trường hợp không tìm thấy ID nhóm (Mặc định lấy nhóm 1 làm fallback để test UI)
        setGroupData(MOCK_GROUPS_DATABASE["group-2"]);
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(apiTimer);
  }, [groupId]);

  // Xử lý bộ lọc tìm kiếm hóa đơn trực tiếp
  const filteredBills = groupData?.bills?.filter((bill: any) =>
    bill.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Xử lý các Menu Actions liên quan
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch(e.key) {
      case 'members':
        setActiveTab("members");
        break;
      case 'edit':
        setActiveTab("edit");
        break;
      case 'export_pdf':
        message.loading({ content: 'Đang tạo báo cáo PDF...', key: 'pdf' });
        setTimeout(() => {
          message.success({ content: 'Đã tải xuống báo cáo chi tiêu (PDF)!', key: 'pdf' });
        }, 1500);
        break;
      case 'share':
        Modal.info({
          title: 'Chia sẻ link công khai',
          content: (
            <div className="mt-4">
              <p className="text-gray-500 mb-3 text-sm">Bất kỳ ai có liên kết này đều có thể xem báo cáo chi tiêu (chỉ xem, không thể sửa).</p>
              <Input 
                value={`https://tripapp.vn/g/share-${groupId}`} 
                readOnly 
                addonAfter={
                  <div className="cursor-pointer text-teal-600 hover:text-teal-700" onClick={() => message.success("Đã copy link!")}>
                    <CopyOutlined /> Copy
                  </div>
                } 
              />
            </div>
          ),
          icon: <ShareAltOutlined className="text-blue-500" />,
          okText: 'Đóng',
          centered: true,
        });
        break;
      case 'export_image':
        setIsExportModalOpen(true);
        break;
      case 'delete':
        Modal.confirm({
          title: 'Bạn có chắc chắn muốn xóa nhóm này?',
          content: 'Toàn bộ hóa đơn, lịch sử chi tiêu và danh sách thành viên sẽ bị xóa vĩnh viễn. Hành động này KHÔNG THỂ hoàn tác.',
          okText: 'Xóa vĩnh viễn',
          okType: 'danger',
          cancelText: 'Hủy',
          centered: true,
          onOk() {
            message.success('Đã xóa nhóm thành công!');
            router.push('/groups');
          }
        });
        break;
    }
  };

  const actionMenuItems: MenuProps['items'] = [
    { key: 'members', icon: <TeamOutlined />, label: 'Quản lý thành viên' },
    { key: 'export_pdf', icon: <FilePdfOutlined className="text-rose-500" />, label: 'Xuất PDF chi tiêu' },
    { key: 'share', icon: <ShareAltOutlined className="text-blue-500" />, label: 'Chia sẻ link công khai' },
    { key: 'export_image', icon: <PictureOutlined className="text-teal-500" />, label: 'Tổng kết chuyến đi (Ảnh)' },
    { type: 'divider' },
    { key: 'edit', icon: <EditOutlined />, label: 'Chỉnh sửa nhóm' },
    { key: 'delete', icon: <DeleteOutlined />, label: 'Xóa nhóm', danger: true },
  ];

  // 3. UI LOADING STATE: Hiển thị vòng xoay tinh tế trong khi chờ nạp dữ liệu
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white lg:rounded-[32px]">
        <Spin size="large" tip="Đang tải thông tin nhóm..." />
      </div>
    );
  }

  // Khai báo biến hỗ trợ check balance nhanh
  const isReceive = groupData.userBalance >= 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] lg:bg-white lg:rounded-[32px] lg:shadow-xl lg:shadow-gray-200/50 lg:border border-gray-100 overflow-hidden relative animate-in slide-in-from-right-8 lg:animate-none">
      
      {/* Header Mobile */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-20">
        <Link href="/groups">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-90 transition-all">
            <LeftOutlined className="text-gray-700" />
          </button>
        </Link>
        <div className="text-center">
          <h2 className="font-black text-lg text-gray-900 leading-tight truncate max-w-[180px]">{groupData.name}</h2>
          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Nhóm {groupData.id}</p>
        </div>
        <Dropdown menu={{ items: actionMenuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-90 transition-all">
            <EllipsisOutlined className="text-gray-700 text-lg" />
          </button>
        </Dropdown>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col pb-24 lg:pb-8">
        
        {/* Header Desktop */}
        <div className="hidden lg:flex items-center justify-between p-8 pb-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center text-3xl shadow-inner relative overflow-hidden">
              <CompassOutlined />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">{groupData.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-teal-100">
                  <TeamOutlined /> {groupData.category} ({groupData.id})
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar.Group>
              {groupData.members.map((member: any) => (
                <Avatar 
                  key={member.id} 
                  src={member.avatar || undefined} 
                  style={!member.avatar ? { backgroundColor: '#f56a00' } : undefined}
                >
                  {!member.avatar && member.textFallback}
                </Avatar>
              ))}
            </Avatar.Group>
            <Dropdown menu={{ items: actionMenuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
              <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer">
                <EllipsisOutlined className="text-lg text-gray-600" />
              </button>
            </Dropdown>
          </div>
        </div>

        {/* TABS DESKTOP */}
        <div className="hidden lg:flex items-center gap-8 px-8 mt-6 border-b border-gray-100">
          <button onClick={() => setActiveTab("bills")} className={`pb-4 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${activeTab === "bills" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <FileTextOutlined /> Hóa đơn
          </button>
          <button onClick={() => setActiveTab("stats")} className={`pb-4 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${activeTab === "stats" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <BarChartOutlined /> Thống kê
          </button>
          <button onClick={() => setActiveTab("settle")} className={`pb-4 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${activeTab === "settle" ? "border-teal-600 text-teal-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            <SwapOutlined /> Thanh toán
          </button>
          <button onClick={() => setActiveTab("add_bill")} className={`pb-4 text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ml-auto ${activeTab === "add_bill" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            <PlusOutlined /> Thêm mới
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 lg:p-8 flex flex-col gap-6 lg:gap-8 flex-1">
          {/* TAB: Hóa Đơn */}
          {activeTab === "bills" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 lg:space-y-8">
              <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Tổng chi tiêu nhóm</p>
                  <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-teal-100">
                    <FileTextOutlined /> {groupData.bills.length} Hóa đơn
                  </div>
                </div>
                <h3 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                  {groupData.totalExpense.toLocaleString()} <span className="text-2xl text-gray-400">{groupData.currency}</span>
                </h3>
                
                {/* Tính toán hiển thị câu thông báo trạng thái nợ/nhận của user linh hoạt */}
                <div className={`inline-flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-sm font-bold mb-6 ${
                  isReceive 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                    : "bg-rose-50 border-rose-100 text-rose-700"
                }`}>
                  {isReceive ? (
                    <>
                      <CheckCircleFilled className="text-emerald-500" /> 
                      Bạn được nhận {groupData.userBalance.toLocaleString()} {groupData.currency}
                    </>
                  ) : (
                    <>
                      <ExclamationCircleFilled className="text-rose-500" /> 
                      Bạn cần trả {Math.abs(groupData.userBalance).toLocaleString()} {groupData.currency}
                    </>
                  )}
                </div>

                <button 
                  onClick={() => setActiveTab("settle")}
                  className="w-full h-14 rounded-2xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] transition-all text-white mt-2 font-bold text-base shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
                >
                  Thanh toán ngay <SwapOutlined />
                </button>
              </div>

              {/* Lịch sử hóa đơn lọc động */}
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between mb-4">
                  <Input 
                    size="large" 
                    placeholder="Tìm kiếm hóa đơn..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="rounded-2xl py-2.5 border-gray-200 bg-white hover:border-teal-400 focus-within:border-teal-500 shadow-sm w-full"
                  />
                </div>

                <div className="space-y-3">
                  {filteredBills.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">Không tìm thấy hóa đơn nào trùng khớp</div>
                  ) : (
                    filteredBills.map((bill: any) => (
                      <div key={bill.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100 hover:border-teal-200 transition cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl shrink-0 border border-orange-100">
                          {bill.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{bill.title}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            {bill.payer} trả <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span> {bill.date}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-black text-gray-900">{bill.amount.toLocaleString()} {groupData.currency}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && <GroupStats />}
          {activeTab === "settle" && <GroupSettle />}
          {activeTab === "add_bill" && <GroupAddBill onCancel={() => setActiveTab("bills")} />}
          
          {/* 2 Tab quản lý hệ thống */}
          {activeTab === "members" && <GroupMembers onBack={() => setActiveTab("bills")} />}
          {activeTab === "edit" && <GroupEdit onBack={() => setActiveTab("bills")} />}

        </div>
      </div>
      
      {/* Bottom Nav Mobile */}
      {!["add_bill", "members", "edit"].includes(activeTab) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-2 flex lg:hidden justify-around items-center z-50 pb-safe animate-in slide-in-from-bottom-full duration-300">
          <div onClick={() => setActiveTab("bills")} className={`flex flex-col items-center justify-center p-2 rounded-2xl w-20 cursor-pointer transition-colors ${activeTab === "bills" ? "text-teal-600 bg-teal-50" : "text-gray-400"}`}>
            <FileTextOutlined className="text-xl mb-1" />
            <span className="text-[10px] font-bold">Bill</span>
          </div>
          <div onClick={() => setActiveTab("stats")} className={`flex flex-col items-center justify-center p-2 rounded-2xl w-20 cursor-pointer transition-colors ${activeTab === "stats" ? "text-teal-600 bg-teal-50" : "text-gray-400"}`}>
            <BarChartOutlined className="text-xl mb-1" />
            <span className="text-[10px] font-bold">Thống kê</span>
          </div>
          <div onClick={() => setActiveTab("settle")} className={`flex flex-col items-center justify-center p-2 rounded-2xl w-20 cursor-pointer transition-colors ${activeTab === "settle" ? "text-teal-600 bg-teal-50" : "text-gray-400"}`}>
            <SwapOutlined className="text-xl mb-1" />
            <span className="text-[10px] font-bold">Thanh toán</span>
          </div>
        </div>
      )}

      {/* FAB (Thêm Bill Mobile) */}
      {!["add_bill", "members", "edit", "settle"].includes(activeTab) && (
        <div 
          onClick={() => setActiveTab("add_bill")}
          className="fixed lg:hidden bottom-24 right-6 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl shadow-xl shadow-gray-900/30 cursor-pointer hover:scale-110 active:scale-95 transition-all z-40"
        >
          <PlusOutlined />
        </div>
      )}

      {/* Gọi component xuất ảnh tổng kết */}
      <TripSummaryExport 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        groupId={groupId} 
      />
    </div>
  );
}