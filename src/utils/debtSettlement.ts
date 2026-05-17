import { GroupMember, Bill, Settlement } from "@/models/index";

/**
 * Thuật toán cấn trừ công nợ tối ưu (Debt Simplification)
 * @param members Danh sách thành viên trong nhóm
 * @param bills Toàn bộ danh sách các hoá đơn đã chi tiêu trong nhóm
 */
export function calculateSettlements(members: GroupMember[], bills: Bill[]): Settlement[] {
  // Bước 1: Khởi tạo bảng cân đối số dư (Balance Map) cho từng thành viên = 0
  const balanceMap: Record<string, number> = {};
  members.forEach((m) => {
    balanceMap[m.id] = 0;
  });

  // Bước 2: Duyệt qua tất cả các hóa đơn để tính toán Net Balance
  bills.forEach((bill) => {
    const payerId = bill.paidBy;
    const totalBillAmount = bill.amount;

    // Người trả tiền được cộng số tiền họ đã ứng trước
    if (balanceMap[payerId] !== undefined) {
      balanceMap[payerId] += totalBillAmount;
    }

    // Những người thụ hưởng bị trừ số tiền họ nợ trong hóa đơn đó
    bill.splits.forEach((split) => {
      if (balanceMap[split.memberId] !== undefined) {
        balanceMap[split.memberId] -= split.amount;
      }
    });
  });

  // Bước 3: Phân loại thành nhóm Con nợ (Owes) và Chủ nợ (Receives)
  const debtors: { memberId: string; amount: number }[] = [];
  const creditors: { memberId: string; amount: number }[] = [];

  Object.keys(balanceMap).forEach((memberId) => {
    const balance = balanceMap[memberId];
    // Bo qua nếu số dư xấp xỉ bằng 0 (tránh sai số số thực JS)
    if (Math.abs(balance) < 1) return;

    if (balance < 0) {
      debtors.push({ memberId, amount: Math.abs(balance) });
    } else {
      creditors.push({ memberId, amount: balance });
    }
  });

  const settlements: Settlement[] = [];
  let i = 0; // Con trỏ cho danh sách debtors
  let j = 0; // Con trỏ cho danh sách creditors

  // Bước 4: Khớp nối cấn trừ bằng thuật toán Greedy Greedy
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // Số tiền giao dịch tối đa là giá trị nhỏ hơn giữa khoản nợ và khoản được nhận
    const settlementAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      fromMemberId: debtor.memberId,
      toMemberId: creditor.memberId,
      amount: Math.round(settlementAmount),
    });

    // Cập nhật lại trạng thái nợ/thu của hai bên
    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;

    if (debtor.amount < 1) i++;
    if (creditor.amount < 1) j++;
  }

  return settlements;
}