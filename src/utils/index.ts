import dayjs from "dayjs";
import "dayjs/locale/vi";
import { BillCategory, GroupCurrency } from "@/models";
import { BILL_CATEGORIES, CURRENCIES } from "@/constants";

dayjs.locale("vi");

// ============================================================
// CURRENCY
// ============================================================
export function formatCurrency(amount: number, currency: GroupCurrency = "VND"): string {
  const curr = CURRENCIES.find((c) => c.value === currency);
  if (currency === "VND") {
    return `${amount.toLocaleString("vi-VN")} ${curr?.symbol ?? "đ"}`;
  }
  return `${curr?.symbol ?? ""}${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function formatCompactCurrency(amount: number, currency: GroupCurrency = "VND"): string {
  if (currency === "VND") {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M đ`;
    if (amount >= 1_000)     return `${(amount / 1_000).toFixed(0)}K đ`;
    return `${amount} đ`;
  }
  return formatCurrency(amount, currency);
}

// ============================================================
// DATE / TIME
// ============================================================
export function formatDate(date: string | Date, format = "DD/MM/YYYY"): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("DD/MM/YYYY HH:mm");
}

export function formatRelativeTime(date: string | Date): string {
  const now   = dayjs();
  const d     = dayjs(date);
  const diff  = now.diff(d, "minute");

  if (diff < 1)    return "Vừa xong";
  if (diff < 60)   return `${diff} phút trước`;
  if (diff < 1440) return `${now.diff(d, "hour")} giờ trước`;
  if (diff < 10080) return `${now.diff(d, "day")} ngày trước`;
  return formatDate(date);
}

export function formatMonthYear(year: number, month: number): string {
  return dayjs(`${year}-${String(month).padStart(2, "0")}-01`).format("MMMM YYYY");
}

export function formatDayOfWeek(date: string): string {
  return dayjs(date).format("dddd, DD/MM");
}

// ============================================================
// CATEGORY HELPERS
// ============================================================
export function getCategoryInfo(category: BillCategory) {
  return BILL_CATEGORIES.find((c) => c.value === category) ?? BILL_CATEGORIES[5];
}

// ============================================================
// NUMBER
// ============================================================
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ============================================================
// STRING
// ============================================================
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

// ============================================================
// MISC
// ============================================================
export function generateInviteLink(groupId: string): string {
  const code = Math.random().toString(36).slice(2, 14).toUpperCase();
  return `https://split.seikou.me/join-${code}`;
}