"use client";

import { useState, useEffect, useMemo } from "react";
import { Form, Input, InputNumber, Select, Radio, Button, Checkbox, Avatar, Tag } from "antd";
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { GroupMember, BillCategory, SplitMethod, BillSplit, GroupCurrency } from "@/models/index";

interface Props {
  members: GroupMember[];
  currency: GroupCurrency;
  onSubmit: (values: any) => void;
  hideTitle?: boolean;
}

const CATEGORIES = [
  { value: "food", label: "🍲 Ăn uống" },
  { value: "transport", label: "🚗 Di chuyển" },
  { value: "accommodation", label: "🏨 Lưu trú" },
  { value: "entertainment", label: "🎡 Giải trí" },
  { value: "shopping", label: "🛍️ Mua sắm" },
  { value: "other", label: "📦 Khác" },
];

export default function CreateExpenseForm({ members, currency, onSubmit, hideTitle }: Props) {
  const [form] = Form.useForm();
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map((m) => m.id));
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});

  const totalAmount = Form.useWatch("amount", form) || 0;

  useEffect(() => {
    if (splitMethod === "equal" && selectedMembers.length > 0) {
      const perPerson = Math.round(totalAmount / selectedMembers.length);
      const newAmounts: Record<string, number> = {};
      selectedMembers.forEach((id) => {
        newAmounts[id] = perPerson;
      });
      setCustomAmounts(newAmounts);
    }
  }, [totalAmount, selectedMembers, splitMethod]);

  const customSum = useMemo(() => {
    if (splitMethod !== "custom") return 0;
    return Object.values(customAmounts).reduce((a, b) => a + b, 0);
  }, [customAmounts, splitMethod]);

  const remainingAmount = totalAmount - customSum;

  const handleCustomAmountChange = (memberId: string, value: number | null) => {
    setCustomAmounts((prev) => ({ ...prev, [memberId]: value || 0 }));
  };

  const onFinish = (values: any) => {
    if (splitMethod === "custom" && remainingAmount !== 0) return;

    const splits: BillSplit[] = members
      .map((m) => {
        const isIncluded = selectedMembers.includes(m.id) || splitMethod === "custom";
        return {
          memberId: m.id,
          amount: isIncluded ? customAmounts[m.id] || 0 : 0,
          isPaid: false,
        };
      })
      .filter((s) => s.amount > 0);

    onSubmit({ ...values, splitMethod, splits, date: new Date().toISOString() });
  };

  const isSubmitDisabled = splitMethod === "custom" && remainingAmount !== 0;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="w-full max-w-xl mx-auto"
      initialValues={{ category: "food" }}
    >
      {/* ── HEADER (ẩn khi drawer đã có header riêng) ── */}
      {!hideTitle && (
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-[22px] font-black text-gray-900 tracking-tight leading-snug">
            Thêm chi tiêu mới
          </h3>
          <p className="text-[13px] text-gray-400 font-medium mt-1">
            Nhập thông tin để tự động tính công nợ nhóm.
          </p>
        </div>
      )}

      <div className={`px-5 space-y-4 pb-10 ${hideTitle ? "pt-5" : ""}`}>

        {/* ── TÊN KHOẢN CHI ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Tên khoản chi
          </label>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên khoản chi!" }]}
            className="mb-0"
          >
            <Input
              prefix={<FileTextOutlined className="text-rose-400 text-base" />}
              placeholder="VD: Ăn lẩu gà lá é, Vé Langbiang…"
              className="rounded-2xl h-[52px] bg-white border-gray-200 hover:border-rose-300 focus:border-rose-400 text-[15px] font-semibold text-gray-800 placeholder:font-normal placeholder:text-gray-300 px-4 shadow-sm"
            />
          </Form.Item>
        </div>

        {/* ── SỐ TIỀN & DANH MỤC ── */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7 space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Số tiền
            </label>
            <Form.Item
              name="amount"
              rules={[{ required: true, message: "Nhập số tiền!" }]}
              className="mb-0"
            >
              <InputNumber
                prefix={<DollarOutlined className="text-rose-400 text-base" />}
                addonAfter={
                  <span className="font-bold text-gray-400 text-xs px-1">{currency}</span>
                }
                placeholder="0"
                className="w-full rounded-2xl overflow-hidden h-[52px] flex items-center border-gray-200 hover:border-rose-300 focus-within:border-rose-400 font-bold text-[16px] shadow-sm"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => Number(v!.replace(/\$\s?|(,*)/g, ""))}
              />
            </Form.Item>
          </div>
          <div className="col-span-5 space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Danh mục
            </label>
            <Form.Item name="category" rules={[{ required: true }]} className="mb-0">
              <Select
                className="h-[52px] w-full"
                popupClassName="rounded-2xl"
                options={CATEGORIES}
              />
            </Form.Item>
          </div>
        </div>

        {/* ── NGƯỜI THANH TOÁN ── */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Ai trả trước?
          </label>
          <Form.Item
            name="paidBy"
            rules={[{ required: true, message: "Chọn người thanh toán!" }]}
            className="mb-0"
          >
            <Select
              className="h-[52px] w-full"
              placeholder="Chọn thành viên"
              popupClassName="rounded-2xl"
              options={members.map((m) => ({
                value: m.id,
                label: (
                  <div className="flex items-center gap-2.5 py-1">
                    <Avatar
                      size={26}
                      className="bg-gradient-to-br from-rose-400 to-pink-500 text-[11px] font-black shrink-0"
                    >
                      {(m.guestName?.[0] || "N").toUpperCase()}
                    </Avatar>
                    <span className="font-semibold text-gray-800 text-[14px]">
                      {m.guestName || "N/A"}
                    </span>
                  </div>
                ),
              }))}
            />
          </Form.Item>
        </div>

        {/* ── PHƯƠNG THỨC CHIA ── */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
            Phương thức chia tiền
          </label>
          <Radio.Group
            value={splitMethod}
            onChange={(e) => setSplitMethod(e.target.value)}
            className="w-full"
          >
            <div className="flex bg-gray-100 p-1.5 rounded-[20px] gap-1">
              {(["equal", "custom"] as SplitMethod[]).map((val) => (
                <Radio.Button
                  key={val}
                  value={val}
                  className={`flex-1 text-center border-0 rounded-[14px] h-10 flex items-center justify-center text-[13px] font-bold transition-all duration-200 ${
                    splitMethod === val
                      ? "bg-white text-gray-900 shadow-sm"
                      : "bg-transparent text-gray-400"
                  }`}
                  style={{ borderRadius: 14 }}
                >
                  {val === "equal" ? "⚖️ Chia đều" : "✏️ Tuỳ chỉnh"}
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </div>

        {/* ── DANH SÁCH THÀNH VIÊN ── */}
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 pt-4 pb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Chia cho ai
            </p>
            {splitMethod === "custom" && (
              <div>
                {remainingAmount > 0 ? (
                  <Tag
                    color="warning"
                    icon={<WarningOutlined />}
                    className="rounded-full font-bold border-0 text-[11px] m-0"
                  >
                    Còn thiếu {remainingAmount.toLocaleString()}đ
                  </Tag>
                ) : remainingAmount < 0 ? (
                  <Tag
                    color="error"
                    icon={<WarningOutlined />}
                    className="rounded-full font-bold border-0 text-[11px] m-0"
                  >
                    Dư {Math.abs(remainingAmount).toLocaleString()}đ
                  </Tag>
                ) : (
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                    className="rounded-full font-bold border-0 text-[11px] m-0"
                  >
                    Khớp hóa đơn 🎉
                  </Tag>
                )}
              </div>
            )}
          </div>

          {/* Members list */}
          <div className="max-h-64 overflow-y-auto px-3 pb-3 space-y-2">
            {splitMethod === "equal" ? (
              <Checkbox.Group
                value={selectedMembers}
                onChange={(checked) => setSelectedMembers(checked as string[])}
                className="w-full flex flex-col gap-2"
              >
                {members.map((m) => {
                  const isChecked = selectedMembers.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`flex justify-between items-center px-3.5 py-3 rounded-[18px] border-2 transition-all duration-200 cursor-pointer select-none ${
                        isChecked
                          ? "bg-rose-50 border-rose-200"
                          : "bg-gray-50 border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox value={m.id} />
                        <Avatar
                          size={32}
                          className={`text-xs font-black ${
                            isChecked
                              ? "bg-gradient-to-br from-rose-400 to-pink-500"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {(m.guestName?.[0] || "N").toUpperCase()}
                        </Avatar>
                        <span className="font-bold text-[14px] text-gray-800">
                          {m.guestName || "N/A"}
                        </span>
                      </div>
                      {isChecked && customAmounts[m.id] ? (
                        <span className="text-[12px] font-extrabold text-rose-500 bg-rose-100 px-3 py-1 rounded-full tabular-nums">
                          {customAmounts[m.id].toLocaleString()}đ
                        </span>
                      ) : (
                        <span className="text-[12px] font-medium text-gray-300 px-2">—</span>
                      )}
                    </label>
                  );
                })}
              </Checkbox.Group>
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center px-3.5 py-3 rounded-[18px] bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={32}
                        className="bg-gradient-to-br from-gray-300 to-gray-400 text-xs font-black"
                      >
                        {(m.guestName?.[0] || "N").toUpperCase()}
                      </Avatar>
                      <span className="font-bold text-[14px] text-gray-800">
                        {m.guestName || "N/A"}
                      </span>
                    </div>
                    <InputNumber
                      value={customAmounts[m.id] || null}
                      onChange={(val) => handleCustomAmountChange(m.id, val)}
                      placeholder="0"
                      className="w-32 rounded-[14px] bg-white border-gray-200 text-right font-bold text-gray-800 focus:border-rose-400"
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => Number(v!.replace(/\$\s?|(,*)/g, ""))}
                      controls={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={isSubmitDisabled}
          className={`h-14 rounded-[20px] font-black text-[15px] tracking-wide border-0 shadow-lg shadow-rose-500/25 transition-all active:scale-[0.98] mt-1 ${
            isSubmitDisabled
              ? "opacity-40 pointer-events-none"
              : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          }`}
        >
          Ghi nhận khoản chi ✓
        </Button>
      </div>
    </Form>
  );
}