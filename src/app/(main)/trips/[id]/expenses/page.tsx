// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { ArrowLeftOutlined, PlusOutlined, DollarOutlined, PieChartOutlined, CoffeeOutlined, CarOutlined, HomeOutlined } from "@ant-design/icons";

// export default function ExpensesPage() {
//   const router = useRouter();
//   const params = useParams();
  
//   // Mock data chi tiêu
//   const expenses = [
//     { id: 1, name: "Ăn sáng Bánh mì xíu mại", amount: 150000, category: "food", paidBy: "Hải", icon: <CoffeeOutlined /> },
//     { id: 2, name: "Thuê xe máy 2 ngày", amount: 300000, category: "transport", paidBy: "Tuấn", icon: <CarOutlined /> },
//     { id: 3, name: "Khách sạn Colline (Cọc 50%)", amount: 1200000, category: "hotel", paidBy: "Hải", icon: <HomeOutlined /> },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
//         <div className="flex items-center gap-3">
//           <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
//             <ArrowLeftOutlined className="text-gray-700" />
//           </button>
//           <h1 className="font-bold text-lg text-gray-900">Quản lý chi tiêu</h1>
//         </div>
//         <button className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition">
//           <PieChartOutlined className="text-lg" />
//         </button>
//       </div>

//       <div className="p-4 max-w-2xl mx-auto space-y-6">
//         {/* Tổng quan */}
//         <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg shadow-rose-200">
//           <p className="text-rose-100 font-medium text-sm mb-1">Tổng chi phí dự kiến</p>
//           <h2 className="text-3xl font-black mb-4 flex items-center gap-2">
//             1,650,000 <span className="text-xl font-medium">VNĐ</span>
//           </h2>
//           <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
//             <DollarOutlined /> Quỹ nhóm còn: 3,350,000 VNĐ
//           </div>
//         </div>

//         {/* Danh sách chi tiêu */}
//         <div>
//           <h3 className="font-bold text-gray-900 mb-3 px-1">Lịch sử giao dịch</h3>
//           <div className="space-y-3">
//             {expenses.map((expense) => (
//               <div key={expense.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
//                 <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 text-xl shrink-0">
//                   {expense.icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-gray-900 truncate">{expense.name}</p>
//                   <p className="text-xs text-gray-500 mt-0.5">Trả bởi: <span className="font-medium text-gray-700">{expense.paidBy}</span></p>
//                 </div>
//                 <div className="shrink-0 text-right">
//                   <p className="font-bold text-rose-600">-{(expense.amount).toLocaleString()}đ</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FAB (Floating Action Button) */}
//       <button className="fixed bottom-6 right-6 w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all text-xl">
//         <PlusOutlined />
//       </button>
//     </div>
//   );
// }



"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  DollarOutlined, 
  PieChartOutlined, 
  CoffeeOutlined, 
  CarOutlined, 
  HomeOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { Drawer, Modal, message } from "antd";

// Import các component của Phase 3 chúng ta vừa hoàn thiện
import CreateExpenseForm from "@/app/(main)/components/trips/CreateExpenseForm";
// import GroupMembersManagement from "@/components/group/GroupMembersManagement";
// import GroupFinancialSummary from "@/components/group/GroupFinancialSummary";
import { Bill, GroupMember, Group, BillCategory } from "@/models/index";

export default function ExpensesPage() {
  const router = useRouter();
  const params = useParams();

  // 1. MOCK DATA PHỤC VỤ CHO QUẢN LÝ NHÓM (Sẽ kết nối API sau)
  const [currentGroup, setCurrentGroup] = useState<Group>({
    id: "group-dalat-2026",
    name: "Đà Lạt Mộng Mơ",
    type: "trip",
    currency: "VND",
    createdBy: "user-1",
    inviteCode: "DL2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [members, setMembers] = useState<GroupMember[]>([
    { id: "m-1", groupId: "group-dalat-2026", userId: "user-1", guestName: "Hải", role: "admin", status: "accepted", joinedAt: "" },
    { id: "m-2", groupId: "group-dalat-2026", userId: "user-2", guestName: "Tuấn", role: "guest", status: "accepted", joinedAt: "" },
    { id: "m-3", groupId: "group-dalat-2026", userId: undefined, guestName: "Mạnh (Khách)", role: "guest", status: "accepted", joinedAt: "" },
  ]);

  const [bills, setBills] = useState<Bill[]>([
    {
      id: "b-1",
      groupId: "group-dalat-2026",
      name: "Ăn sáng Bánh mì xíu mại",
      amount: 150000,
      currency: "VND",
      category: "food",
      paidBy: "m-1", // ID của Hải
      splitMethod: "equal",
      splits: [
        { memberId: "m-1", amount: 50000, isPaid: false },
        { memberId: "m-2", amount: 50000, isPaid: false },
        { memberId: "m-3", amount: 50000, isPaid: false },
      ],
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "b-2",
      groupId: "group-dalat-2026",
      name: "Thuê xe máy 2 ngày",
      amount: 300000,
      currency: "VND",
      category: "transport",
      paidBy: "m-2", // ID của Tuấn
      splitMethod: "equal",
      splits: [
        { memberId: "m-1", amount: 150000, isPaid: false },
        { memberId: "m-2", amount: 150000, isPaid: false },
      ],
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  // 2. CÁC TRẠNG THÁI ĐIỀU KHIỂN UI ANTD
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Helper ánh xạ Icon danh mục cho danh sách lịch sử
  const getCategoryIcon = (category: BillCategory) => {
    switch (category) {
      case "food": return <CoffeeOutlined />;
      case "transport": return <CarOutlined />;
      case "accommodation": return <HomeOutlined />;
      default: return <DollarOutlined />;
    }
  };

  // Tính tổng chi phí trực tiếp từ danh sách hóa đơn thực tế
  const totalExpenseAmount = useMemo(() => {
    return bills.reduce((sum, b) => sum + b.amount, 0);
  }, [bills]);

  // 3. XỬ LÝ SỰ KIỆN TỪ CÁC FORM
  const handleCreateExpense = (newExpenseValues: any) => {
    const newBill: Bill = {
      id: `b-${Date.now()}`,
      groupId: currentGroup.id,
      name: newExpenseValues.name,
      amount: newExpenseValues.amount,
      currency: currentGroup.currency,
      category: newExpenseValues.category,
      paidBy: newExpenseValues.paidBy,
      splitMethod: newExpenseValues.splitMethod,
      splits: newExpenseValues.splits,
      date: newExpenseValues.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBills((prev) => [newBill, ...prev]);
    setIsExpenseOpen(false);
    message.success("Đã thêm chi tiêu mới và tự động cấn trừ công nợ!");
  };

  const handleAddGuestMember = (name: string) => {
    const newGuest: GroupMember = {
      id: `m-${Date.now()}`,
      groupId: currentGroup.id,
      userId: undefined,
      guestName: name,
      role: "guest",
      status: "accepted",
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newGuest]);
  };

  // Helper tìm tên hiển thị của người thanh toán hóa đơn
  const getPayerName = (memberId: string) => {
    return members.find(m => m.id === memberId)?.guestName || "Không rõ";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
            <ArrowLeftOutlined className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Quản lý chi tiêu</h1>
        </div>
        
        <div className="flex gap-2">
          {/* Nút xem danh sách thành viên */}
          <button 
            onClick={() => setIsMembersOpen(true)}
            className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition"
          >
            <TeamOutlined className="text-lg" />
          </button>
          {/* Nút xem báo cáo phân rã nợ */}
          <button 
            onClick={() => setIsSummaryOpen(true)}
            className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition"
          >
            <PieChartOutlined className="text-lg" />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Tổng quan */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg shadow-rose-200">
          <p className="text-rose-100 font-medium text-sm mb-1">Tổng chi phí thực tế</p>
          <h2 className="text-3xl font-black mb-4 flex items-center gap-2">
            {totalExpenseAmount.toLocaleString()} <span className="text-xl font-medium">{currentGroup.currency}</span>
          </h2>
          <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
            <DollarOutlined /> Thành viên nhóm: {members.length} người
          </div>
        </div>

        {/* Danh sách chi tiêu thực tế lấy từ State */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 px-1">Lịch sử giao dịch</h3>
          {bills.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 text-gray-400">
              Chưa có chi tiêu nào. Hãy nhấn dấu (+) để thêm!
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map((expense) => (
                <div key={expense.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{expense.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Trả bởi: <span className="font-medium text-gray-700">{getPayerName(expense.paidBy)}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-rose-600">-{expense.amount.toLocaleString()}đ</p>
                    <p className="text-[10px] text-gray-400 font-medium italic">🎯 {expense.splits.length} người chia</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB (Floating Action Button) - Bấm mở Form thêm Chi Tiêu */}
      <button 
        onClick={() => setIsExpenseOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all text-xl z-20"
      >
        <PlusOutlined />
      </button>

      {/* DRAWER: FORM TẠO CHI TIÊU MỚI (Tối ưu hóa trải nghiệm Mobile) */}
      <Drawer
        title={null}
        placement="bottom"
        closable={false}
        onClose={() => setIsExpenseOpen(false)}
        open={isExpenseOpen}
        height="auto"
        styles={{ body: { padding: 0, backgroundColor: "#f9fafb", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" } }}
      >
        {/* Nút giả làm thanh gạt để đóng drawer theo hành vi Mobile */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" onClick={() => setIsExpenseOpen(false)} />
        <CreateExpenseForm 
          members={members} 
          currency={currentGroup.currency} 
          onSubmit={handleCreateExpense} 
        />
      </Drawer>

      {/* MODAL: QUẢN LÝ THÀNH VIÊN TRONG NHÓM */}
      <Modal
        open={isMembersOpen}
        onCancel={() => setIsMembersOpen(false)}
        footer={null}
        centered
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        {/* <GroupMembersManagement 
          group={currentGroup} 
          members={members} 
          currentUserId="user-1" 
          onAddGuest={handleAddGuestMember} 
        /> */}
      </Modal>

      {/* MODAL: TỔNG QUAN TÀI CHÍNH & THUẬT TOÁN QUYẾT TOÁN CÔNG NỢ */}
      <Modal
        open={isSummaryOpen}
        onCancel={() => setIsSummaryOpen(false)}
        footer={null}
        centered
        styles={{ body: { padding: 8 } }}
        closable={false}
      >
        {/* <GroupFinancialSummary 
          group={currentGroup} 
          members={members} 
          bills={bills} 
        /> */}
      </Modal>
    </div>
  );
}