import {
  User, UserProfile, BankAccount,
  Group, GroupMember, GroupWithStats,
  Bill, BillWithPayer,
  Payment, PaymentWithMembers, Settlement,
  Trip, TripWithStats,
  ItineraryDay, ItineraryLocation,
  CalendarMonthSummary,
  Notification,
} from "@/models";

// ============================================================
// USERS
// ============================================================
export const MOCK_CURRENT_USER: UserProfile = {
  id:              "user-001",
  displayName:     "0065_ Phạm Thanh Sự",
  email:           "psu95228@gmail.com",
  avatarUrl:       "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
  provider:        "email",
  groupCount:      1,
  bankAccountCount: 0,
  theme:           "system",
  language:        "vi",
  appVersion:      "1.2.0",
  createdAt:       "2024-01-01T00:00:00Z",
  updatedAt:       "2026-04-25T10:00:00Z",
};

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id:          "user-002",
    displayName: "Test",
    email:       "test@example.com",
    avatarUrl:   undefined,
    provider:    "email",
    createdAt:   "2024-02-01T00:00:00Z",
    updatedAt:   "2026-04-24T10:00:00Z",
  },
];

// ============================================================
// BANK ACCOUNTS
// ============================================================
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [];

// ============================================================
// GROUP MEMBERS
// ============================================================
export const MOCK_GROUP_MEMBERS: GroupMember[] = [
  {
    id:        "member-001",
    groupId:   "group-001",
    userId:    "user-001",
    role:      "admin",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    status:    "accepted",
    joinedAt:  "2026-04-01T00:00:00Z",
  },
  {
    id:        "member-002",
    groupId:   "group-001",
    userId:    "user-002",
    guestName: "Test",
    role:      "guest",
    status:    "accepted",
    joinedAt:  "2026-04-01T08:00:00Z",
  },
];

// ============================================================
// GROUPS
// ============================================================
export const MOCK_GROUPS: GroupWithStats[] = [
  {
    id:           "group-001",
    name:         "Test",
    type:         "trip",
    currency:     "VND",
    coverImageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    createdBy:    "user-001",
    createdAt:    "2026-04-01T00:00:00Z",
    updatedAt:    "2026-04-25T10:00:00Z",
    members:      MOCK_GROUP_MEMBERS,
    totalExpense: 100_000,
    myShare:      50_000,
    toReceive:    50_000,
    toPay:        0,
    dayCount:     1,
    billCount:    1,
    memberCount:  2,
  },
];

// ============================================================
// BILLS
// ============================================================
export const MOCK_BILLS: BillWithPayer[] = [
  {
    id:           "bill-001",
    groupId:      "group-001",
    name:         "Cà phê",
    amount:       100_000,
    currency:     "VND",
    category:     "food",
    note:         "",
    receiptImageUrl: undefined,
    paidBy:       "member-001",
    payerName:    "0065_ Phạm Thanh Sự",
    payerAvatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    splitMethod:  "equal",
    splits: [
      { memberId: "member-001", amount: 50_000, isPaid: true,  paidAt: "2026-04-24T13:31:00Z" },
      { memberId: "member-002", amount: 50_000, isPaid: false },
    ],
    date:      "2026-04-24",
    createdAt: "2026-04-24T13:31:00Z",
    updatedAt: "2026-04-24T13:31:00Z",
  },
];

// ============================================================
// PAYMENTS (Thanh toán)
// ============================================================
export const MOCK_PAYMENTS: PaymentWithMembers[] = [
  {
    id:           "pay-001",
    groupId:      "group-001",
    fromMemberId: "member-002",
    toMemberId:   "member-001",
    fromMember:   MOCK_GROUP_MEMBERS[1],
    toMember:     MOCK_GROUP_MEMBERS[0],
    amount:       50_000,
    currency:     "VND",
    status:       "pending",
    createdAt:    "2026-04-25T09:00:00Z",
  },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  { fromMemberId: "member-002", toMemberId: "member-001", amount: 50_000 },
];

// ============================================================
// TRIPS (Lịch trình)
// ============================================================
export const MOCK_TRIPS: TripWithStats[] = [
  {
    id:        "trip-001",
    groupId:   "group-001",
    name:      "Test",
    coverImageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    currency:  "VND",
    status:    "ongoing",
    startDate: "2026-04-24",
    endDate:   "2026-04-24",
    createdBy: "user-001",
    members: [
      {
        userId:      "user-001",
        avatarUrl:   "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
        displayName: "0065_ Phạm Thanh Sự",
      },
      {
        userId:      "user-002",
        displayName: "Test",
      },
    ],
    dayCount:      1,
    locationCount: 1,
    createdAt:     "2026-04-24T00:00:00Z",
    updatedAt:     "2026-04-24T10:00:00Z",
  },
  {
    id:        "trip-002",
    groupId:   "group-002",
    name:      "Test",
    coverImageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    currency:  "VND",
    status:    "ongoing",
    startDate: "2026-04-24",
    endDate:   "2026-04-24",
    createdBy: "user-001",
    members: [
      {
        userId:      "user-001",
        avatarUrl:   "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
        displayName: "0065_ Phạm Thanh Sự",
      },
      {
        userId:      "user-002",
        displayName: "Test",
      },
    ],
    dayCount:      1,
    locationCount: 1,
    createdAt:     "2026-04-24T00:00:00Z",
    updatedAt:     "2026-04-24T10:00:00Z",
  },
  {
    id:        "trip-003",
    groupId:   "group-003",
    name:      "Test",
    coverImageUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
    currency:  "VND",
    status:    "ongoing",
    startDate: "2026-04-24",
    endDate:   "2026-04-24",
    createdBy: "user-001",
    members: [
      {
        userId:      "user-001",
        avatarUrl:   "https://api.dicebear.com/7.x/thumbs/svg?seed=ptsu",
        displayName: "0065_ Phạm Thanh Sự",
      },
      {
        userId:      "user-002",
        displayName: "Test",
      },
    ],
    dayCount:      1,
    locationCount: 1,
    createdAt:     "2026-04-24T00:00:00Z",
    updatedAt:     "2026-04-24T10:00:00Z",
  },
];

// ============================================================
// ITINERARY
// ============================================================
export const MOCK_ITINERARY_LOCATIONS: ItineraryLocation[] = [
  {
    id:        "loc-001",
    dayId:     "day-001",
    tripId:    "trip-001",
    name:      "Chợ Đà Lạt",
    address:   "Chợ Đà Lạt, 24 Đường Nguyễn Thị Minh Khai",
    category:  "shopping",
    lat:       11.9404,
    lng:       108.4383,
    startTime: "09:00",
    endTime:   "10:00",
    order:     1,
    createdAt: "2026-04-24T00:00:00Z",
  },
];

export const MOCK_ITINERARY_DAYS: ItineraryDay[] = [
  {
    id:        "day-001",
    tripId:    "trip-001",
    date:      "2026-04-24",
    dayNumber: 1,
    title:     "Thứ Sáu, 24/04",
    locations: MOCK_ITINERARY_LOCATIONS,
  },
];

// ============================================================
// CALENDAR
// ============================================================
export const MOCK_CALENDAR_MONTH: CalendarMonthSummary = {
  year:         2026,
  month:        4,
  totalExpense: 100_000,
  billCount:    1,
  groupCount:   1,
  dayCount:     1,
  days: [
    {
      date:         "2026-04-24",
      totalExpense: 100_000,
      billCount:    1,
      hasActivity:  true,
    },
  ],
};

// ============================================================
// NOTIFICATIONS
// ============================================================
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id:        "notif-001",
    userId:    "user-001",
    type:      "payment_request",
    title:     "Yêu cầu thanh toán",
    message:   "Test cần trả bạn 50.000đ",
    isRead:    false,
    relatedId: "group-001",
    createdAt: "2026-04-25T09:00:00Z",
  },
];