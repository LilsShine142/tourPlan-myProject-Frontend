"use client";

import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select, Radio, Button, Checkbox, Avatar, message } from "antd";
import { DollarOutlined, TagOutlined, FileTextOutlined } from "@ant-design/icons";
import { GroupMember, BillCategory, SplitMethod, BillSplit, GroupCurrency } from "@/models/index";

interface Props {
  members: GroupMember[];
  currency: GroupCurrency;
  onSubmit: (values: any) => void;
}

export default function CreateExpenseForm({ members, currency, onSubmit }: Props) {
  const [form] = Form.useForm();
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map(m => m.id));
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const totalAmount = Form.useWatch("amount", form) || 0;

  // Tự động phân bổ lại số tiền khi tổng tiền hoặc số người được tích chọn thay đổi (Dành cho mode 'equal')
  useEffect(() => {
    if (splitMethod === "equal" && selectedMembers.length > 0) {
      const perPerson = Math.round(totalAmount / selectedMembers.length);
      const newAmounts: Record<string, number> = {};
      selectedMembers.forEach(id => {
        newAmounts[id] = perPerson;
      });
      setCustomAmounts(newAmounts);
    }
  }, [totalAmount, selectedMembers, splitMethod]);

  const handleCustomAmountChange = (memberId: string, value: number | null) => {
    setCustomAmounts(prev => ({ ...prev, [memberId]: value || 0 }));
  };

  const onFinish = (values: any) => {
    // Validate số tiền tuỳ chỉnh nếu không phải chế độ chia đều
    if (splitMethod === "custom") {
      const sum = Object.values(customAmounts).reduce((a, b) => a + b, 0);
      if (sum !== totalAmount) {
        return message.error(`Tổng số tiền chia (${sum.toLocaleString()}đ) phải bằng tổng hóa đơn (${totalAmount.toLocaleString()}đ)`);
      }
    }

    const splits: BillSplit[] = members.map(m => {
      const isIncluded = selectedMembers.includes(m.id) || splitMethod === "custom";
      return {
        memberId: m.id,
        amount: isIncluded ? (customAmounts[m.id] || 0) : 0,
        isPaid: false
      };
    }).filter(s => s.amount > 0);

    onSubmit({
      ...values,
      splitMethod,
      splits,
      date: new Date().toISOString()
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="max-w-md mx-auto bg-white p-5 rounded-2xl shadow-sm border border-gray-100" initialValues={{ category: "food" }}>
      <h3 className="text-base font-black text-gray-800 mb-4">Thêm khoản chi tiêu mới</h3>

      <Form.Item name="name" rules={[{ required: true, message: "Nhập tên khoản chi!" }]}>
        <Input prefix={<FileTextOutlined className="text-gray-400" />} placeholder="Ví dụ: Ăn lẩu gà lá é, Vé cổng Langbiang..." className="rounded-xl h-11" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item name="amount" rules={[{ required: true, message: "Nhập số tiền!" }]}>
          <InputNumber prefix={<DollarOutlined className="text-gray-400" />} addonAfter={currency} placeholder="Số tiền" className="w-full rounded-xl overflow-hidden h-11 flex items-center" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value!.replace(/\$\s?|(,*)/g, "")} />
        </Form.Item>

        <Form.Item name="category" rules={[{ required: true }]}>
          <Select className="h-11 rounded-xl" options={[
            { value: "food", label: "🍲 Ăn uống" },
            { value: "transport", label: "🚗 Di chuyển" },
            { value: "accommodation", label: "🏨 Lưu trú" },
            { value: "entertainment", label: "🎡 Giải trí" },
            { value: "shopping", label: "🛍️ Mua sắm" },
            { value: "other", label: "📦 Chi phí khác" },
          ]} />
        </Form.Item>
      </div>

      <Form.Item name="paidBy" label={<span className="text-xs font-bold text-gray-500 uppercase">Ai là người trả tiền?</span>} rules={[{ required: true, message: "Chọn người thanh toán!" }]}>
        <Select className="h-11 rounded-xl" placeholder="Chọn thành viên quẹt thẻ/trả tiền" options={members.map(m => ({ value: m.id, label: m.guestName }))} />
      </Form.Item>

      <div className="mb-4">
        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Phương thức chia tiền</label>
        <Radio.Group value={splitMethod} onChange={(e) => setSplitMethod(e.target.value)} className="w-full flex">
          <Radio.Button value="equal" className="flex-1 text-center rounded-l-xl">Chia đều</Radio.Button>
          <Radio.Button value="custom" className="flex-1 text-center rounded-r-xl">Tùy chỉnh (Nhập tiền)</Radio.Button>
        </Radio.Group>
      </div>

      <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 mb-5 max-h-60 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phân chia chi tiết</p>
        
        {splitMethod === "equal" ? (
          <Checkbox.Group value={selectedMembers} onChange={(checked) => setSelectedMembers(checked as string[])} className="w-full flex flex-col gap-3">
            {members.map(m => (
              <div key={m.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-50">
                <Checkbox value={m.id} className="font-semibold text-xs text-gray-700">{m.guestName}</Checkbox>
                {selectedMembers.includes(m.id) && (
                  <span className="text-xs font-bold text-teal-600">+{customAmounts[m.id]?.toLocaleString()} {currency}</span>
                )}
              </div>
            ))}
          </Checkbox.Group>
        ) : (
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.id} className="flex justify-between items-center bg-white p-2 px-3 rounded-xl border border-gray-50">
                <span className="font-semibold text-xs text-gray-700">{m.guestName}</span>
                <InputNumber
                    value={customAmounts[m.id] || 0}
                    onChange={(val) => handleCustomAmountChange(m.id, val)}
                    placeholder="0"
                    className="w-32 rounded-lg"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ""))}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="primary" htmlType="submit" block className="h-12 bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm shadow-lg shadow-teal-600/10">
        Ghi nhận khoản chi
      </Button>
    </Form>
  );
}