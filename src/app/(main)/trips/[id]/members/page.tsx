"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined, UserAddOutlined, CrownOutlined, LinkOutlined, DeleteOutlined } from "@ant-design/icons";

export default function MembersPage() {
  const router = useRouter();
  const params = useParams();

  const members = [
    { id: 1, name: "Quang Hải", role: "admin", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Minh Tuấn", role: "member", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Thảo Vy", role: "member", avatar: "https://i.pravatar.cc/150?u=3" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
            <ArrowLeftOutlined className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Thành viên nhóm</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Mời thêm người */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100 flex flex-col items-center text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-3">
            <UserAddOutlined />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Mời bạn bè tham gia</h3>
          <p className="text-sm text-gray-500 mb-4 px-4">Chia sẻ liên kết này để bạn bè cùng tham gia chỉnh sửa lịch trình và chi tiêu.</p>
          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-2xl font-semibold hover:bg-purple-700 transition">
            <LinkOutlined /> Sao chép liên kết mời
          </button>
        </div>

        {/* Danh sách thành viên */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 px-1">Danh sách ({members.length})</h3>
          <div className="space-y-3">
            {members.map((user) => (
              <div key={user.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    {user.name}
                    {user.role === "admin" && <CrownOutlined className="text-amber-500" title="Trưởng nhóm" />}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                {user.role !== "admin" && (
                  <button className="w-10 h-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition">
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}