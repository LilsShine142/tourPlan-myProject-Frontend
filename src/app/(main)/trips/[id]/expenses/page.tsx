"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DollarOutlined,
  PieChartOutlined,
  CoffeeOutlined,
  CarOutlined,
  HomeOutlined,
  TeamOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Drawer, Modal, message, Grid } from "antd";

import CreateExpenseForm from "@/app/(main)/components/trips/CreateExpenseForm";
import { Bill, GroupMember, Group, BillCategory } from "@/models/index";
import GroupInfoModal from "@/app/(main)/components/trips/GroupInfoModal";
import MobileBottomSheet from "@/components/MobileBottomSheet";

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ExpensesPage() {
  const router = useRouter();
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.md;
  // Thay thế 2 state cũ bằng 1 state quản lý Modal gọn gàng hơn
  const [activeModal, setActiveModal] = useState<"none" | "members" | "summary">("none");
  
  const [currentGroup] = useState<Group>({
    id: "group-dalat-2026",
    name: "Đà Lạt Mộng Mơ",
    type: "trip",
    currency: "VND",
    createdBy: "user-1",
    inviteCode: "DL2026",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [members] = useState<GroupMember[]>([
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
      paidBy: "m-1",
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
      paidBy: "m-2",
      splitMethod: "equal",
      splits: [
        { memberId: "m-1", amount: 150000, isPaid: false },
        { memberId: "m-2", amount: 150000, isPaid: false },
      ],
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const getCategoryConfig = (category: BillCategory) => {
    switch (category) {
      case "food":          return { icon: <CoffeeOutlined />, colors: "bg-orange-100 text-orange-500" };
      case "transport":     return { icon: <CarOutlined />,    colors: "bg-blue-100 text-blue-500" };
      case "accommodation": return { icon: <HomeOutlined />,   colors: "bg-purple-100 text-purple-500" };
      default:              return { icon: <DollarOutlined />, colors: "bg-teal-100 text-teal-500" };
    }
  };

  // Tính tổng chi phí
  const totalExpenseAmount = useMemo(
    () => bills.reduce((sum, b) => sum + b.amount, 0),
    [bills]
  );

  // Tính toán công nợ (Balance)
  const memberBalances = useMemo(() => {
    return members.map((m) => {
      let paid = 0;
      let share = 0;
      bills.forEach((b) => {
        if (b.paidBy === m.id) paid += b.amount;
        const split = b.splits.find((s) => s.memberId === m.id);
        if (split) share += split.amount;
      });
      return { ...m, paid, share, balance: paid - share };
    });
  }, [members, bills]);

  // Handle Logic Thêm / Sửa Member (Mở rộng sau này)
  const handleAddMember = () => {
    console.log("Mở form thêm thành viên...");
  };

  const handleEditMember = (member: any) => {
    console.log("Mở form sửa thành viên: ", member);
  };

  const handleCreateExpense = (values: any) => {
    const newBill: Bill = {
      id: `b-${Date.now()}`,
      groupId: currentGroup.id,
      name: values.name,
      amount: values.amount,
      currency: currentGroup.currency,
      category: values.category,
      paidBy: values.paidBy,
      splitMethod: values.splitMethod,
      splits: values.splits,
      date: values.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBills((prev) => [newBill, ...prev]);
    setIsExpenseOpen(false);
    message.success({ content: "Thêm chi tiêu thành công!", className: "rounded-2xl" });
  };

  const getPayerName = (memberId: string) =>
    members.find((m) => m.id === memberId)?.guestName || "Không rõ";

  // Shared form — dùng lại cho cả mobile sheet lẫn desktop drawer
  const expenseForm = (
    <CreateExpenseForm
      members={members}
      currency={currentGroup.currency}
      onSubmit={handleCreateExpense}
      hideTitle
    />
  );

  return (
    <div className="min-h-screen bg-[#F6F8FA] pb-32 font-sans">

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-20 bg-white/75 backdrop-blur-2xl px-5 py-4 flex items-center justify-between border-b border-gray-100/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-[16px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 active:scale-90 transition-transform"
          >
            <ArrowLeftOutlined className="text-base" />
          </button>
          <div>
            <h1 className="font-black text-[20px] text-gray-900 tracking-tight leading-tight">
              Chi tiêu
            </h1>
            <p className="text-xs text-gray-400 font-medium">{currentGroup.name}</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Desktop: nút thêm chi tiêu ngay trên header */}
          <button
            onClick={() => setIsExpenseOpen(true)}
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white h-10 px-5 rounded-[14px] font-bold text-sm shadow-md shadow-rose-400/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <PlusOutlined className="text-base" />
            Thêm chi tiêu
          </button>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setActiveModal("members")} // Set active modal
              className="w-10 h-10 rounded-[16px] bg-white border border-gray-100 text-gray-500 flex items-center justify-center active:bg-gray-50 transition-colors shadow-sm"
            >
              <TeamOutlined className="text-base" />
            </button>
            <button
              onClick={() => setActiveModal("summary")} // Set active modal
              className="w-10 h-10 rounded-[16px] bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center active:bg-rose-100 transition-colors shadow-sm"
            >
              <PieChartOutlined className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-4 mt-6 max-w-2xl mx-auto space-y-8">

        {/* Summary card */}
        <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 rounded-[36px] p-7 text-white shadow-2xl shadow-rose-500/25 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="text-rose-100/80 font-semibold text-[11px] mb-2 uppercase tracking-widest">
              Tổng chi phí nhóm
            </p>
            <h2 className="text-[42px] font-black mb-5 tracking-tighter drop-shadow-sm flex items-end justify-center gap-1.5">
              {totalExpenseAmount.toLocaleString()}
              <span className="text-[20px] font-bold mb-1 opacity-80">{currentGroup.currency}</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 font-semibold shadow-sm">
              <TeamOutlined /> {members.length} thành viên tham gia
            </div>
          </div>
        </div>

        {/* Bill list */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-[18px] text-gray-900 tracking-tight">
              Lịch sử giao dịch
            </h3>
            <span className="text-sm font-semibold text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full">
              {bills.length} mục
            </span>
          </div>

          {bills.length === 0 ? (
            <div className="bg-white rounded-[32px] py-14 px-6 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                <DollarOutlined className="text-3xl text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">Chưa có chi tiêu nào.</p>
              <p className="text-gray-400 text-sm mt-1">Bấm nút bên dưới để thêm mới nhé!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.map((expense) => {
                const cc = getCategoryConfig(expense.category);
                return (
                  <div
                    key={expense.id}
                    className="group bg-white px-4 py-4 rounded-[24px] flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-[0.98] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-pointer"
                  >
                    <div className={`w-[52px] h-[52px] rounded-[18px] flex items-center justify-center text-xl shrink-0 ${cc.colors}`}>
                      {cc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 truncate text-[15px] tracking-tight">
                        {expense.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[12px] text-gray-400 font-semibold">
                        <span className="truncate max-w-[100px]">{getPayerName(expense.paidBy)}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>Chia {expense.splits.length} người</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right flex flex-col items-end gap-1">
                      <p className="font-black text-[16px] text-rose-500 tracking-tight tabular-nums">
                        -{expense.amount.toLocaleString()}
                        <span className="text-[11px] ml-0.5 font-bold">đ</span>
                      </p>
                      <MoreOutlined className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── FAB — Mobile only ── */}
      <div className="fixed bottom-6 w-full max-w-2xl px-6 pointer-events-none z-20 left-1/2 -translate-x-1/2 flex justify-end md:hidden">
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="pointer-events-auto flex items-center gap-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white h-14 px-6 rounded-[22px] shadow-xl shadow-rose-500/30 active:scale-95 transition-all font-bold text-[15px]"
        >
          <PlusOutlined className="text-lg" />
          Thêm chi tiêu
        </button>
      </div>

      {/* ── MOBILE: Bottom Sheet cho form thêm chi tiêu ── */}
      {!isDesktop && (
        <MobileBottomSheet
          open={isExpenseOpen}
          onClose={() => setIsExpenseOpen(false)}
          title="Thêm khoản chi tiêu mới"
          subtitle="Nhập chi tiết hóa đơn để hệ thống tự động cấn trừ công nợ."
          defaultVh={70}
          maxVh={90}
        >
          {expenseForm}
        </MobileBottomSheet>
      )}

      {/* ── DESKTOP: Ant Design Drawer (floating panel) ── */}
      {isDesktop && (
        <Drawer
          title={null}
          placement="right"
          closable={false}
          onClose={() => setIsExpenseOpen(false)}
          open={isExpenseOpen}
          width={isDesktop ? "27%" : "100%"}
          style={{
            borderRadius: 24,
            overflow: "hidden",
          }}
          styles={{
            body: {
              padding: 0,
              backgroundColor: "#F6F8FA",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              paddingBottom: isDesktop ? 20 : 0,
            },
            wrapper: {
              boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
              borderRadius: 24,
            },
            mask: {
              backdropFilter: "blur(3px)",
              backgroundColor: "rgba(0,0,0,0.25)",
            },
          }}
        >
          {/* Desktop header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-3 bg-white border-b border-gray-100">
            <div>
              <h2 className="font-black text-[17px] text-gray-900 tracking-tight">Thêm chi tiêu</h2>
              <p className="text-[11px] text-gray-400 font-medium">{currentGroup.name}</p>
            </div>
            <button
              onClick={() => setIsExpenseOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain pb-8">
            {expenseForm}
          </div>
        </Drawer>
      )}

      {/* ── GỌI COMPONENT MODAL TÁI SỬ DỤNG ── */}
      <GroupInfoModal
        open={activeModal !== "none"}
        type={activeModal}
        onClose={() => setActiveModal("none")}
        members={members}
        currency={currentGroup.currency}
        totalExpenseAmount={totalExpenseAmount}
        memberBalances={memberBalances}
        onAddMember={handleAddMember}
        onEditMember={handleEditMember}
      />
    </div>
  );
}