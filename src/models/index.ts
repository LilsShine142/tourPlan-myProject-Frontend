// ============================================================
// MODELS / TYPES
// Đây là toàn bộ TypeScript type definitions cho hệ thống.
// Dùng làm blueprint để thiết kế database (PostgreSQL/MySQL/MongoDB).
// ============================================================

// ------------------------------------------------------------
// AUTH / USER
// ------------------------------------------------------------
export type AuthProvider = "email" | "google" | "apple";
export type UserRole = "admin" | "member" | "guest";
export type ThemeMode = "light" | "dark" | "system";
export type Language = "vi" | "en";

export interface User {
  id: string;
  displayName: string;             // e.g. "0065_ Phạm Thanh Sự"
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  createdAt: string;               // ISO date
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  birthday?: string;
  gender?: "male" | "female" | "other";
  coverUrl?: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    [key: string]: string | undefined;
  };
  groupCount: number;
  bankAccountCount: number;
  theme: ThemeMode;
  language: Language;
  appVersion: string;              // e.g. "1.2.0"
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  createdAt: string;
}

// ------------------------------------------------------------
// GROUP (Nhóm)
// ------------------------------------------------------------
export type GroupType = "trip" | "household" | "general"; // Chi tiêu chung | Nhà chung | Tất cả
export type GroupCurrency = "VND" | "USD" | "EUR" | "JPY";
export type MemberRole = "admin" | "guest";

// export interface Group {
//   id: string;
//   name: string;
//   type: GroupType;
//   currency: GroupCurrency;
//   coverImageUrl?: string;
//   createdBy: string;               // userId
//   createdAt: string;
//   updatedAt: string;
// }

// export interface GroupMember {
//   id: string;
//   groupId: string;
//   userId?: string;                 // null nếu là khách (guest)
//   guestName?: string;              // dùng khi userId null
//   avatarUrl?: string;
//   role: MemberRole;
//   joinedAt: string;
// }

// Sửa đổi 1: Bảng Group
export interface Group {
  id: string;
  name: string;
  type: GroupType;
  currency: GroupCurrency;
  coverImageUrl?: string;
  inviteCode?: string;     // BỔ SUNG: Dùng để tạo link invite (/invite/12345)
  createdBy: string;       // userId
  createdAt: string;
  updatedAt: string;
}

// Sửa đổi 2: Bảng GroupMember
export interface GroupMember {
  id: string;
  groupId: string;
  userId?: string;         // null nếu là khách (guest)
  guestName?: string;      // dùng khi userId null
  avatarUrl?: string;
  role: MemberRole;
  status: "pending" | "accepted"; // BỔ SUNG: Trạng thái duyệt vào nhóm
  joinedAt: string;
}

export interface GroupWithStats extends Group {
  members: GroupMember[];
  totalExpense: number;
  myShare: number;                 // phần của user hiện tại
  toReceive: number;               // cần nhận
  toPay: number;                   // cần trả
  dayCount: number;                // số ngày có chi
  billCount: number;               // số khoản chi
  memberCount: number;             // số thành viên
}

// ------------------------------------------------------------
// BILL (Khoản chi)
// ------------------------------------------------------------
export type BillCategory =
  | "food"        // Ăn uống
  | "transport"   // Di chuyển
  | "accommodation" // Lưu trú
  | "entertainment" // Giải trí
  | "shopping"
  | "other";

export type SplitMethod = "equal" | "percentage" | "custom" | "manual";

export interface BillSplit {
  memberId: string;                // groupMemberId
  amount: number;
  percentage?: number;
  isPaid: boolean;
  paidAt?: string;
}

// Sửa đổi 3: Bảng Bill (Nếu bạn muốn tính năng "chờ mọi người xác nhận" như Transaction cũ)
export interface Bill {
  id: string;
  groupId: string;
  name: string;
  amount: number;
  currency: GroupCurrency;
  category: BillCategory;
  note?: string;
  receiptImageUrl?: string;
  paidBy: string;          // groupMemberId
  splitMethod: SplitMethod;
  splits: BillSplit[];
  confirmations?: string[];// BỔ SUNG: Mảng chứa memberId của những người đã bấm "Xác nhận bill này đúng"
  date: string;            // ISO date
  createdAt: string;
  updatedAt: string;
}
// export interface Bill {
//   id: string;
//   groupId: string;
//   name: string;
//   amount: number;
//   currency: GroupCurrency;
//   category: BillCategory;
//   note?: string;
//   receiptImageUrl?: string;
//   paidBy: string;                  // groupMemberId
//   splitMethod: SplitMethod;
//   splits: BillSplit[];
//   date: string;                    // ISO date
//   createdAt: string;
//   updatedAt: string;
// }

export interface BillWithPayer extends Bill {
  payerName: string;
  payerAvatarUrl?: string;
}

// ------------------------------------------------------------
// PAYMENT (Thanh toán)
// ------------------------------------------------------------
export type PaymentStatus = "pending" | "confirmed" | "cancelled";

export interface Payment {
  id: string;
  groupId: string;
  fromMemberId: string;            // người trả
  toMemberId: string;              // người nhận
  amount: number;
  currency: GroupCurrency;
  status: PaymentStatus;
  qrCodeUrl?: string;
  confirmedAt?: string;
  createdAt: string;
}

export interface PaymentWithMembers extends Payment {
  fromMember: GroupMember;
  toMember: GroupMember;
}

// Balance settlement suggestion
export interface Settlement {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

// ------------------------------------------------------------
// TRIP / ITINERARY (Lịch trình)
// ------------------------------------------------------------
export type TripStatus = "planning" | "ongoing" | "completed";

export interface Trip {
  id: string;
  groupId?: string;                // linked group (optional)
  name: string;
  coverImageUrl?: string;
  currency: GroupCurrency;
  status: TripStatus;
  startDate: string;
  endDate: string;
  createdBy: string;               // userId
  members: TripMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TripMember {
  userId: string;
  avatarUrl?: string;
  displayName: string;
}

export interface TripWithStats extends Trip {
  dayCount: number;
  locationCount: number;
  coverImageUrl: string;
}

// Bảng Trip dành cho doanh nghiệp (Bán tour): Bảng Public Feed (Bảng tin) liên kết với Trip
export interface PublishedTour {
  feedId: string;
  tripId: string; // Foreign Key nối sang bảng Trip
  trip: TripWithStats; // Dữ liệu trip được join vào
  likes: number;
  publisherType: 'user' | 'business'; // Phân biệt người dùng thường hay công ty du lịch
  price?: number; // Giá tour (Chỉ công ty mới có, hoặc chi phí tham khảo)
  isSponsored?: boolean; // Tour có được trả tiền để quảng cáo không
}

// ------------------------------------------------------------
// ITINERARY DAY & LOCATION (Ngày & Địa điểm)
// ------------------------------------------------------------
export type LocationCategory =
  | "restaurant"    // Nhà hàng / Ăn uống
  | "shopping"      // Mua sắm
  | "attraction"    // Điểm tham quan
  | "accommodation" // Chỗ ở
  | "transport"     // Phương tiện
  | "other";

export interface ItineraryDay {
  id: string;
  tripId: string;
  date: string;                    // ISO date
  dayNumber: number;
  title?: string;
  locations: ItineraryLocation[];
}

export type TravelMode = "driving" | "walking" | "transit" | "bicycling" | "flight";

export interface ItineraryLocation {
  date: string;
  id: string;
  dayId: string;
  tripId: string;
  name: string;
  address?: string;
  category: LocationCategory;
  
  // -- Cốt lõi cho Bản đồ --
  lat?: number;
  lng?: number;
  placeId?: string; // BỔ SUNG: Dùng để gọi API chính xác của Google/Mapbox

  startTime?: string;              // "09:00"
  endTime?: string;                // "10:00"
  note?: string;
  order: number;                   // thứ tự trong ngày
  
  // -- BỔ SUNG: Dành cho tính năng Chỉ đường (Tùy chọn nhưng khuyên dùng) --
  travelModeToNext?: TravelMode;   // Phương tiện để đi đến điểm tiếp theo (nếu có)
  distanceToNext?: number;         // Khoảng cách tới điểm tiếp theo (đơn vị: mét)
  durationToNext?: number;         // Thời gian di chuyển ước tính (đơn vị: giây)
  routePolyline?: string;          // Lưu trữ chuỗi mã hóa đoạn đường vẽ trên map (giúp vẽ line offline không cần gọi API)

  createdAt: string;
}

// ------------------------------------------------------------
// CALENDAR (Lịch)
// ------------------------------------------------------------
export interface CalendarDaySummary {
  date: string;                    // "YYYY-MM-DD"
  totalExpense: number;
  billCount: number;
  hasActivity: boolean;
}

export interface CalendarMonthSummary {
  year: number;
  month: number;                   // 1-12
  totalExpense: number;
  billCount: number;
  groupCount: number;
  dayCount: number;                // số ngày có chi tiêu
  days: CalendarDaySummary[];
}

export interface CategorySummary {
  category: BillCategory;
  total: number;
  percentage: number;
  billCount: number;
}

// ------------------------------------------------------------
// NOTIFICATION
// ------------------------------------------------------------
export type NotificationType =
  | "payment_request"   // yêu cầu thanh toán
  | "payment_confirmed" // đã xác nhận thanh toán
  | "group_invite"      // mời vào nhóm
  | "new_bill"          // thêm khoản chi mới
  | "balance_update";   // cập nhật số dư

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;              // groupId / billId / paymentId
  createdAt: string;
}

// ------------------------------------------------------------
// FEEDBACK
// ------------------------------------------------------------
export type FeedbackType = "bug" | "feature" | "other";

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  content: string;
  createdAt: string;
}


// ------------------------------------------------------------
// TRANSACTION & BALANCE (Giao dịch & Số dư)
// ------------------------------------------------------------
// export interface Transaction {
//   id: string;
//   tripId: string;
//   payerId: string;        // Người trả tiền ban đầu
//   amount: number;
//   description: string;
//   date: Date;
//   confirmations: number;   // Số lượng thành viên đã xác nhận (vd: 1/2)
// }

export interface UserBalance {
  userId: string;
  userName: string;
  amount: number;         // Số tiền âm (nợ) hoặc dương (được nhận)
  type: 'owe' | 'receive';
}

// ------------------------------------------------------------
// API RESPONSE WRAPPER
// ------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}