
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal, Grid } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { GroupMember } from "@/models/index";

import MobileBottomSheet from "@/components/MobileBottomSheet";

// ─────────────────────────────────────────────────────────────
// 2. GROUP INFO MODAL (Export chính)
// ─────────────────────────────────────────────────────────────

export interface MemberBalance extends GroupMember {
  paid: number;
  share: number;
  balance: number;
}

interface GroupInfoModalProps {
  open: boolean;
  type: "members" | "summary" | "none";
  onClose: () => void;
  members: GroupMember[];
  currency: string;
  totalExpenseAmount?: number;
  memberBalances?: MemberBalance[];
  onAddMember?: () => void;
  onEditMember?: (member: GroupMember) => void;
}

export default function GroupInfoModal({
  open,
  type,
  onClose,
  members,
  currency,
  totalExpenseAmount = 0,
  memberBalances = [],
  onAddMember,
  onEditMember,
}: GroupInfoModalProps) {
  const screens = Grid.useBreakpoint();
  const isDesktop = !!screens.md;

  if (type === "none") return null;

  const isMembers = type === "members";
  const title = isMembers ? "Thành viên nhóm" : "Tổng quan tài chính";
  const subtitle = isMembers ? `${members.length} người tham gia` : undefined;

  // ── Nội dung dùng chung cho cả modal và sheet ──
  const content = (
    <div className="px-5 py-4 space-y-3">
      {isMembers ? (
        <>
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="group flex items-center justify-between p-3.5 rounded-[20px] border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-rose-100 to-pink-100 text-rose-500 font-black text-sm flex items-center justify-center shadow-sm shrink-0">
                    {m.guestName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[15px]">{m.guestName}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-[12px] text-gray-400 font-medium">
                        {m.role === "admin" ? "👑 Quản trị viên" : "👤 Thành viên"}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                          m.status === "accepted"
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-500"
                        }`}
                      >
                        {m.status === "accepted" ? "Đã tham gia" : "Chờ duyệt"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onEditMember?.(m)}
                  className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200 flex items-center justify-center shadow-sm transition-all shrink-0"
                >
                  <EditOutlined className="text-[13px]" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onAddMember}
            className="w-full h-12 rounded-[16px] border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 active:bg-rose-100 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <PlusOutlined /> Thêm thành viên
          </button>
        </>
      ) : (
        <>
          {/* Tổng chi tiêu */}
          <div className="p-5 rounded-[22px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-gray-400 text-[11px] font-medium mb-1.5 uppercase tracking-widest">
              Tổng chi tiêu nhóm
            </p>
            <p className="text-[32px] font-black tracking-tight flex items-baseline gap-1.5">
              {totalExpenseAmount.toLocaleString()}
              <span className="text-[16px] text-gray-400 font-bold">{currency}</span>
            </p>
          </div>
          
          {/* Công nợ từng người */}
          <h3 className="font-bold text-[11px] text-gray-400 uppercase tracking-widest pl-1 pt-1">
            Chi tiết công nợ
          </h3>
          <div className="space-y-3">
            {memberBalances.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[34px] h-[34px] rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center text-xs shrink-0">
                      {m.guestName?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-800 text-[15px]">{m.guestName}</span>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-black text-[16px] tracking-tight ${
                        m.balance > 0
                          ? "text-teal-500"
                          : m.balance < 0
                          ? "text-rose-500"
                          : "text-gray-400"
                      }`}
                    >
                      {m.balance > 0 ? "+" : ""}
                      {m.balance.toLocaleString()}đ
                    </p>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                        m.balance > 0
                          ? "text-teal-500/70"
                          : m.balance < 0
                          ? "text-rose-400"
                          : "text-gray-400"
                      }`}
                    >
                      {m.balance > 0 ? "Sẽ nhận lại" : m.balance < 0 ? "Cần trả thêm" : "Đã hòa vốn"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-gray-500 bg-gray-50/80 px-3 py-2.5 rounded-[14px]">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Đã ứng</span>
                    <span className="font-bold text-gray-700">{m.paid.toLocaleString()}đ</span>
                  </div>
                  <div className="w-px h-6 bg-gray-200" />
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">Mức chia</span>
                    <span className="font-bold text-gray-700">{m.share.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: AntD Modal ── */}
      {isDesktop && (
        <Modal
          open={open}
          onCancel={onClose}
          footer={null}
          centered
          styles={{
            body: { borderRadius: "24px", padding: 0 },
            mask: { backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }
          }}
          closable={false}
          width={480}
        >
          <div className="bg-white rounded-[24px]">
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-[20px] font-black text-gray-900 tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs font-medium text-gray-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold active:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="max-h-[70vh] overflow-y-auto">{content}</div>
          </div>
        </Modal>
      )}

      {/* ── MOBILE: Bottom Sheet ── */}
      {!isDesktop && (
        <MobileBottomSheet
          open={open}
          onClose={onClose}
          title={title}
          subtitle={subtitle}
          defaultVh={65}
          maxVh={85}
        >
          {content}
        </MobileBottomSheet>
      )}
    </>
  );
}