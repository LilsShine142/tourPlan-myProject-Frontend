import {
  BillCategory,
  GroupCurrency,
  LocationCategory,
  MemberRole,
} from "@/models";

// ============================================================
// BILL CATEGORIES
// ============================================================
export const BILL_CATEGORIES: {
  value: BillCategory;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  suggestions: string[];
}[] = [
  {
    value: "food",
    label: "Ăn uống",
    emoji: "🍽️",
    color: "#F39C12",
    bgColor: "#FEF9E7",
    suggestions: ["Cà phê", "Bữa trưa", "Bữa tối", "Ăn sáng"],
  },
  {
    value: "transport",
    label: "Di chuyển",
    emoji: "🚗",
    color: "#3498DB",
    bgColor: "#EBF5FB",
    suggestions: ["Taxi", "Grab", "Xăng", "Vé xe"],
  },
  {
    value: "accommodation",
    label: "Lưu trú",
    emoji: "🏨",
    color: "#9B59B6",
    bgColor: "#F5EEF8",
    suggestions: ["Khách sạn", "Homestay", "Resort"],
  },
  {
    value: "entertainment",
    label: "Giải trí",
    emoji: "⭐",
    color: "#F1C40F",
    bgColor: "#FEFCE8",
    suggestions: ["Vé vào cửa", "Vui chơi", "Spa"],
  },
  {
    value: "shopping",
    label: "Mua sắm",
    emoji: "🛍️",
    color: "#E91E63",
    bgColor: "#FCE4EC",
    suggestions: ["Đặc sản", "Quà lưu niệm"],
  },
  {
    value: "other",
    label: "Khác",
    emoji: "📦",
    color: "#95A5A6",
    bgColor: "#F2F3F4",
    suggestions: [],
  },
];

// ============================================================
// QUICK AMOUNTS
// ============================================================
export const QUICK_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000];

// ============================================================
// CURRENCIES
// ============================================================
export const CURRENCIES: { value: GroupCurrency; label: string; symbol: string }[] = [
  { value: "VND", label: "Việt Nam Đồng", symbol: "đ" },
  { value: "USD", label: "US Dollar",     symbol: "$" },
  { value: "EUR", label: "Euro",          symbol: "€" },
  { value: "JPY", label: "Japanese Yen",  symbol: "¥" },
];

// ============================================================
// MEMBER ROLES
// ============================================================
export const MEMBER_ROLES: { value: MemberRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "guest", label: "Khách" },
];

// ============================================================
// LOCATION CATEGORIES (Itinerary)
// ============================================================
export const LOCATION_CATEGORIES: {
  value: LocationCategory;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { value: "restaurant",    label: "Ăn uống",       emoji: "🍽️", color: "#F39C12" },
  { value: "shopping",      label: "Mua sắm",        emoji: "🛒", color: "#E91E63" },
  { value: "attraction",    label: "Tham quan",      emoji: "📍", color: "#00B894" },
  { value: "accommodation", label: "Chỗ ở",          emoji: "🏨", color: "#9B59B6" },
  { value: "transport",     label: "Di chuyển",      emoji: "🚗", color: "#3498DB" },
  { value: "other",         label: "Khác",           emoji: "📦", color: "#95A5A6" },
];

// ============================================================
// SPLIT METHODS
// ============================================================
export const SPLIT_METHODS = [
  { value: "equal",      label: "Chia đều",   icon: "⊙" },
  { value: "percentage", label: "Theo %",      icon: "%" },
  { value: "custom",     label: "Tuỳ chỉnh",  icon: "≊" },
  { value: "manual",     label: "Thủ công",   icon: "≡" },
] as const;

// ============================================================
// BOTTOM NAV TABS
// ============================================================
export const BOTTOM_NAV_TABS = [
  { key: "groups",   label: "Nhóm",       href: "/groups"   },
  { key: "trips",    label: "Lịch trình", href: "/trips"    },
  { key: "calendar", label: "Lịch",       href: "/calendar" },
  { key: "profile",  label: "Cá nhân",    href: "/profile"  },
] as const;

// ============================================================
// THEME
// ============================================================
export const ANT_DESIGN_THEME = {
  token: {
    colorPrimary:      "#00B894",
    colorPrimaryHover: "#009A7C",
    colorSuccess:      "#00B894",
    colorWarning:      "#F39C12",
    colorError:        "#E74C3C",
    colorInfo:         "#3498DB",
    borderRadius:      12,
    borderRadiusLG:    16,
    borderRadiusSM:    8,
    fontFamily:        "'Be Vietnam Pro', system-ui, sans-serif",
    fontSize:          14,
    fontSizeLG:        16,
    colorBgContainer:  "#FFFFFF",
    colorBgLayout:     "#F8F9FA",
    boxShadow:         "0 2px 16px rgba(0,0,0,0.06)",
  },
};