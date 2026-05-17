"use client";

import { useState } from "react";
import { Input, Button, Avatar, Badge } from "antd";
import { 
  BellOutlined, 
  PlusOutlined, 
  ArrowDownOutlined, 
  ArrowUpOutlined,
  SearchOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LeftOutlined,
  SwapOutlined,
  BarChartOutlined,
  TeamOutlined,
  CompassOutlined,
  CoffeeOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from "@ant-design/icons";

export default function GroupsPage() {
  // State để demo thao tác chọn nhóm trên Desktop
  const [selectedGroup, setSelectedGroup] = useState<string | null>("group-1");

  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] pb-24 lg:pb-6 font-sans">
      <div className="max-w-7xl mx-auto lg:p-6 flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-80px)]">
        
        {/* ============================================================ */}
        {/* BÊN TRÁI: DANH SÁCH NHÓM (Dành cho Mobile + Cột trái Desktop) */}
        {/* ============================================================ */}
        <div className={`w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 px-4 pt-6 lg:px-0 lg:pt-0 ${selectedGroup ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Nhóm</h1>
            <Button type="text" shape="circle" icon={<BellOutlined className="text-xl text-gray-600" />} />
          </div>

          {/* Thẻ Summary (Dark Teal) */}
          <div className="bg-gradient-to-br from-[#0B635D] to-[#084A45] rounded-[32px] p-6 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-teal-100/80 text-xs font-bold tracking-widest uppercase mb-1">Đang theo dõi</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black">1</span>
                  <span className="text-teal-50 text-lg font-medium">nhóm</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
                  <ArrowDownOutlined className="text-emerald-400 text-xs" />
                  <span className="text-sm font-bold text-emerald-50">1 được nhận</span>
                </div>
                <div className="bg-rose-500/20 border border-rose-400/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md opacity-60">
                  <ArrowUpOutlined className="text-rose-400 text-xs" />
                  <span className="text-sm font-bold text-rose-50">— còn nợ</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-6 pt-4 border-t border-teal-600/50 flex items-center gap-2">
              <div className="w-4 h-1.5 bg-emerald-400 rounded-full"></div>
              <p className="text-sm text-teal-100 font-medium">Bạn là đại gia bao nuôi cả nhóm</p>
            </div>
          </div>

          {/* Tabs Filter */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            <button className="px-5 py-2.5 bg-teal-600 text-white rounded-full font-semibold text-sm shadow-md shadow-teal-600/20 whitespace-nowrap">Tất cả</button>
            <button className="px-5 py-2.5 bg-white text-gray-500 rounded-full font-semibold text-sm border border-gray-100 whitespace-nowrap">Chi tiêu chung</button>
            <button className="px-5 py-2.5 bg-white text-gray-500 rounded-full font-semibold text-sm border border-gray-100 whitespace-nowrap">Nhà chung</button>
          </div>

          {/* Tiêu đề danh sách */}
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-xl font-bold text-gray-800">Nhóm của bạn</h2>
            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">1</div>
          </div>

          {/* Item Nhóm (Test) */}
          <div 
            onClick={() => setSelectedGroup("group-1")}
            className="bg-white rounded-[28px] p-4 flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-teal-100 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-3xl shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
              <CompassOutlined />
              <div className="absolute bottom-1 bg-white text-teal-600 text-[9px] font-bold px-2 rounded-full uppercase">VND</div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Test</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 bg-teal-50 w-max px-2 py-0.5 rounded-md mb-2">
                <FileTextOutlined /> Chi tiêu
              </div>
              <Avatar.Group size="small" maxCount={2}>
                <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" />
                <Avatar style={{ backgroundColor: '#f56a00' }}>T</Avatar>
              </Avatar.Group>
            </div>

            <div className="text-right">
              <p className="text-emerald-500 font-bold text-base">+50.000 đ</p>
              <p className="text-xs text-gray-400 font-medium mt-1">được nhận</p>
            </div>
          </div>

          {/* Nút Tạo nhóm mới */}
          <div className="border-2 border-dashed border-teal-200 bg-teal-50/50 rounded-[28px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-50 transition-colors mt-2 relative overflow-hidden group">
            <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-teal-500/30 mb-3 group-hover:scale-110 transition-transform">
              <PlusOutlined />
            </div>
            <h3 className="text-teal-700 font-bold text-lg">Tạo Nhóm Mới</h3>
            <p className="text-teal-600/70 text-sm mt-1">Cùng nhau quản lý chi tiêu</p>
          </div>

        </div>

        {/* ============================================================ */}
        {/* BÊN PHẢI: CHI TIẾT NHÓM (Chỉ hiện trên Desktop hoặc khi ở Mobile được chọn) */}
        {/* ============================================================ */}
        <div className={`flex-1 flex-col bg-[#F7F9FA] lg:bg-white lg:rounded-[32px] lg:shadow-sm lg:border border-gray-100 overflow-hidden ${selectedGroup ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Nút Back (Chỉ hiện trên Mobile) */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <Button type="text" shape="circle" icon={<LeftOutlined />} onClick={() => setSelectedGroup(null)} />
            <h2 className="font-bold text-lg">Test</h2>
            <Button type="text" shape="circle" icon={<EllipsisOutlined />} />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-8 flex flex-col gap-6">
            
            {/* Header Màn Chi Tiết */}
            <div className="hidden lg:flex items-center justify-between pb-6 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center text-2xl shadow-inner">
                  <CompassOutlined />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Test</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <TeamOutlined /> Chi tiêu chung
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar.Group>
                  <Avatar src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" />
                  <Avatar style={{ backgroundColor: '#f56a00' }}>T</Avatar>
                </Avatar.Group>
                <Button shape="circle" icon={<EllipsisOutlined />} className="bg-gray-50 border-0" />
              </div>
            </div>

            {/* Thẻ Tổng Chi Tiêu */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Tổng chi tiêu</p>
                <div className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FileTextOutlined /> 1
                </div>
              </div>
              
              <h3 className="text-4xl font-black text-gray-900 mb-3">100.000 <span className="text-2xl underline decoration-2 underline-offset-4">đ</span></h3>
              
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold mb-6">
                <CheckCircleFilled className="text-emerald-500" /> Được nhận 50.000 đ
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <p className="text-gray-500 text-sm"><span className="font-bold text-gray-700">Test</span> nợ bạn</p>
                <p className="text-emerald-500 font-bold">50.000 đ</p>
              </div>

              <Button type="primary" className="w-full h-12 rounded-2xl bg-teal-600 hover:bg-teal-500 border-0 mt-4 font-bold text-base shadow-lg shadow-teal-600/20">
                Thanh toán →
              </Button>
            </div>

            {/* Banner Xuất PDF */}
            <div className="bg-[#0B635D] rounded-[28px] p-5 flex items-center justify-between text-white shadow-md">
              <div>
                <p className="text-[10px] font-bold text-teal-200/80 uppercase tracking-wider mb-1">PDF</p>
                <h4 className="text-lg font-bold">Xuất báo cáo chi tiêu</h4>
                <p className="text-teal-100/70 text-xs mt-0.5">Bao gồm danh sách bill và gợi ý thanh toán</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl mb-1 backdrop-blur-sm">
                  <FileTextOutlined />
                </div>
                <span className="text-xs font-semibold">Xuất</span>
              </div>
            </div>

            {/* Bộ Lọc & Tìm kiếm */}
            <div className="flex items-center gap-3 mt-2">
              <button className="px-5 py-2 bg-teal-600 text-white rounded-full font-semibold text-sm shadow-md shadow-teal-600/20">Tất cả</button>
              <button className="px-4 py-2 bg-white text-gray-500 rounded-full font-semibold text-sm border border-gray-100 flex items-center gap-2">
                <CoffeeOutlined /> Ăn uống <span className="text-gray-300">1</span>
              </button>
            </div>
            <Input 
              size="large" 
              placeholder="Tìm kiếm chi tiêu..." 
              prefix={<SearchOutlined className="text-gray-400" />}
              className="rounded-2xl py-3 border-gray-100 bg-white"
            />

            {/* Danh sách Bill */}
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3 ml-2">Hôm qua</p>
              <div className="bg-white rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-gray-50 cursor-pointer hover:border-teal-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xl">
                    <CoffeeOutlined />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Cà phê</h4>
                    <p className="text-xs text-teal-600 font-medium mt-0.5">
                      0065_Phạm Thanh Sự <span className="text-gray-400">· 24/04</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-base">100.000 đ</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Navigation Toolbar (Thay cho NavBar trên Mobile) */}
          <div className="bg-white border-t border-gray-100 p-2 flex justify-around items-center rounded-b-[32px] lg:hidden pb-safe">
            <div className="flex flex-col items-center justify-center p-2 text-teal-600 bg-teal-50 rounded-2xl w-20">
              <FileTextOutlined className="text-xl mb-1" />
              <span className="text-[10px] font-bold">Bill</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-gray-400 w-20">
              <BarChartOutlined className="text-xl mb-1" />
              <span className="text-[10px] font-medium">Thống kê</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-gray-400 w-20">
              <SwapOutlined className="text-xl mb-1" />
              <span className="text-[10px] font-medium">Thanh toán</span>
            </div>
          </div>

          {/* Nút FAB dấu cộng (Thêm Bill) */}
          <div className="fixed lg:absolute bottom-24 lg:bottom-10 right-6 lg:right-10 w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-500/40 cursor-pointer hover:scale-110 transition-transform z-50">
            <PlusOutlined />
          </div>

        </div>

      </div>

      {/* GLOBAL MOBILE BOTTOM NAV (Chỉ hiện ở màn hình ngoài cùng) */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center p-2 pb-safe lg:hidden z-40 ${selectedGroup ? 'hidden' : 'flex'}`}>
        <div className="flex flex-col items-center justify-center p-2 text-teal-600">
          <TeamOutlined className="text-xl mb-1" />
          <span className="text-[10px] font-bold">Nhóm</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-gray-400">
          <CompassOutlined className="text-xl mb-1" />
          <span className="text-[10px] font-medium">Lịch trình</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-gray-400">
          <FileTextOutlined className="text-xl mb-1" />
          <span className="text-[10px] font-medium">Lịch</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-gray-400">
          <Avatar size="small" src="https://api.dicebear.com/7.x/thumbs/svg?seed=Tuấn" className="mb-1" />
          <span className="text-[10px] font-medium">Cá nhân</span>
        </div>
      </div>

    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Button, Tag, Avatar, Empty, App, Spin } from "antd";
// import {
//   PlusOutlined,
//   BellOutlined,
//   TeamOutlined,
//   FileTextOutlined,
//   HomeOutlined,
//   ArrowRightOutlined,
// } from "@ant-design/icons";
// import { useRouter } from "next/navigation";
// import { MOCK_GROUPS } from "@/lib/mockData";
// import { formatCurrency } from "@/utils";
// import { GroupWithStats } from "@/models";
// import { APP_ROUTES } from "@/config/routes";
// import {CreateTripModal} from "@/components/modals/CreateTripModal";

// type FilterTab = "all" | "trip" | "household";

// export default function GroupsPage() {
//   const router  = useRouter();
//   const { message } = App.useApp();
//   const [filter,       setFilter]       = useState<FilterTab>("all");
//   const [showCreate,   setShowCreate]   = useState(false);
//   const [loading,      setLoading]      = useState(false);
//   const [groups,       setGroups]       = useState(MOCK_GROUPS);

//   const filtered = groups.filter((g) =>
//     filter === "all"       ? true :
//     filter === "trip"      ? g.type === "trip" :
//     filter === "household" ? g.type === "household" : true
//   );

//   // Summary stats
//   const totalReceive = groups.reduce((s, g) => s + g.toReceive, 0);
//   const totalPay     = groups.reduce((s, g) => s + g.toPay,     0);

//   const GroupCard = ({ group }: { group: GroupWithStats }) => (
//     <div
//       onClick={() => router.push(APP_ROUTES.MAIN.GROUP_DETAIL(group.id))}
//       className="bg-white rounded-3xl p-5 shadow-card border border-gray-100
//                  hover:shadow-float hover:border-primary-200
//                  active:scale-[0.98] cursor-pointer
//                  transition-all duration-300"
//     >
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center gap-3">
//           {/* Icon */}
//           <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-xl flex-shrink-0">
//             ✈️
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-900 text-base">{group.name}</h3>
//             <div className="flex items-center gap-1.5 mt-1">
//               <Tag className="rounded-full text-xs m-0 border-0 bg-gray-100 text-gray-500">
//                 {group.currency}
//               </Tag>
//               {/* Member avatars */}
//               <Avatar.Group size={18} max={{ count: 3 }}>
//                 {group.members.map((m) => (
//                   <Avatar
//                     key={m.id}
//                     src={m.avatarUrl}
//                     size={18}
//                     className="bg-primary-400 text-white text-[10px]"
//                   >
//                     {!m.avatarUrl && (m.guestName ?? "U")[0].toUpperCase()}
//                   </Avatar>
//                 ))}
//               </Avatar.Group>
//               <span className="text-xs text-gray-400">{group.memberCount} người</span>
//             </div>
//           </div>
//         </div>
//         <ArrowRightOutlined className="text-gray-400 mt-1.5" />
//       </div>

//       {/* Balance */}
//       {group.toReceive > 0 && (
//         <div className="mt-3 bg-primary-50 rounded-2xl px-4 py-2.5 flex items-center justify-between">
//           <span className="text-sm text-gray-600">Được nhận lại</span>
//           <span className="font-bold text-primary-600">
//             +{formatCurrency(group.toReceive, group.currency)}
//           </span>
//         </div>
//       )}
//       {group.toPay > 0 && (
//         <div className="mt-2 bg-red-50 rounded-2xl px-4 py-2.5 flex items-center justify-between">
//           <span className="text-sm text-gray-600">Cần trả</span>
//           <span className="font-bold text-red-500">
//             -{formatCurrency(group.toPay, group.currency)}
//           </span>
//         </div>
//       )}
//       {group.toReceive === 0 && group.toPay === 0 && (
//         <div className="mt-3 bg-gray-50 rounded-2xl px-4 py-2.5">
//           <span className="text-sm text-gray-500">Chi tiêu đã cân bằng</span>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="max-w-2xl mx-auto px-4 pt-6 md:pt-20">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h1 className="text-2xl font-black text-gray-900">Nhóm</h1>
//           <p className="text-sm text-gray-500 mt-0.5">{groups.length} nhóm</p>
//         </div>
//         <Button
//           onClick={() => router.push("/profile/notifications")}
//           icon={<BellOutlined />}
//           shape="circle"
//           size="large"
//           className="border-0 bg-white shadow-card hover:bg-gray-50"
//         />
//       </div>

//       {/* Summary card */}
//       <div className="bg-primary-600 rounded-3xl p-5 mb-5 text-white">
//         <p className="text-xs font-semibold uppercase tracking-wide text-primary-100 mb-2">ĐANG THEO DÕI</p>
//         <div className="flex items-baseline gap-2 mb-4">
//           <span className="text-4xl font-black">{groups.length}</span>
//           <span className="text-primary-200">nhóm</span>
//         </div>
//         <div className="flex gap-3">
//           <div className="flex-1 bg-white/10 rounded-2xl px-3 py-2.5">
//             <div className="flex items-center gap-1.5 text-green-300 mb-1">
//               <span className="text-xs">●</span>
//               <span className="text-xs font-medium">được nhận</span>
//             </div>
//             <span className="font-bold text-white text-sm">
//               {formatCurrency(totalReceive)}
//             </span>
//           </div>
//           <div className="flex-1 bg-white/10 rounded-2xl px-3 py-2.5">
//             <div className="flex items-center gap-1.5 text-red-300 mb-1">
//               <span className="text-xs">●</span>
//               <span className="text-xs font-medium">còn nợ</span>
//             </div>
//             <span className="font-bold text-white text-sm">
//               {formatCurrency(totalPay)}
//             </span>
//           </div>
//         </div>
//         {totalPay === 0 && totalReceive > 0 && (
//           <p className="text-xs text-primary-200 mt-3 text-right">Bạn là đại gia bao nuôi cả nhóm 😄</p>
//         )}
//       </div>

//       {/* Filter tabs */}
//       <div className="flex gap-2 mb-5">
//         {([
//           { key: "all",       label: "Tất cả"      },
//           { key: "trip",      label: "Chi tiêu chung" },
//           { key: "household", label: "Nhà chung"   },
//         ] as { key: FilterTab; label: string }[]).map((f) => (
//           <button
//             key={f.key}
//             onClick={() => setFilter(f.key)}
//             className={`
//               px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
//               ${filter === f.key
//                 ? "bg-primary-500 text-white shadow-float"
//                 : "bg-white text-gray-500 shadow-card hover:bg-gray-50"
//               }
//             `}
//           >
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {/* Group list */}
//       <div className="mb-4">
//         <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
//           Nhóm của bạn
//           <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">{filtered.length}</span>
//         </h2>

//         {loading ? (
//           <div className="flex justify-center py-12"><Spin size="large" /></div>
//         ) : filtered.length === 0 ? (
//           <Empty description="Chưa có nhóm nào" className="py-12" />
//         ) : (
//           <div className="space-y-3">
//             {filtered.map((g) => <GroupCard key={g.id} group={g} />)}
//           </div>
//         )}
//       </div>

//       {/* Create new group card */}
//       <button
//         onClick={() => setShowCreate(true)}
//         className="
//           w-full py-6 border-2 border-dashed border-primary-200 rounded-3xl
//           bg-primary-50/50 text-primary-500
//           hover:bg-primary-50 hover:border-primary-400
//           active:scale-[0.98]
//           transition-all duration-200
//           flex flex-col items-center gap-2 mb-6
//         "
//       >
//         <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center">
//           <PlusOutlined className="text-xl" />
//         </div>
//         <span className="font-bold text-primary-600">Tạo Nhóm Mới</span>
//         <span className="text-xs text-primary-400">Cùng nhau quản lý chi tiêu</span>
//       </button>

//       {/* Floating + on mobile */}
//       <button
//         onClick={() => setShowCreate(true)}
//         className="
//           fixed bottom-24 right-5 z-30
//           w-14 h-14 rounded-full bg-primary-500 text-white
//           flex items-center justify-center
//           shadow-float
//           active:scale-90 transition-all duration-200
//           md:hidden
//         "
//       >
//         <PlusOutlined className="text-2xl" />
//       </button>

//       <CreateTripModal open={showCreate} onClose={() => setShowCreate(false)} />
//     </div>
//   );
// }