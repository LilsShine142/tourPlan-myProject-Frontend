import { create } from "zustand";
import { UserProfile, Notification } from "@/models";
import { MOCK_CURRENT_USER, MOCK_NOTIFICATIONS } from "@/lib/mockData";

// ============================================================
// AUTH STORE
// ============================================================
interface AuthState {
  user:          UserProfile | null;
  isLoading:     boolean;
  isAuthenticated: boolean;
  setUser:       (user: UserProfile | null) => void;
  setLoading:    (v: boolean) => void;
  logout:        () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            MOCK_CURRENT_USER, // fake: already logged in
  isLoading:       false,
  isAuthenticated: true,

  setUser:    (user)     => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout:     ()         => set({ user: null, isAuthenticated: false }),
}));

// ============================================================
// NOTIFICATION STORE
// ============================================================
interface NotificationState {
  notifications: Notification[];
  unreadCount:   number;
  markAsRead:    (id: string) => void;
  markAllRead:   () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount:   MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount:   0,
    })),
}));

// ============================================================
// UI STORE (global loading, modals)
// ============================================================
interface UIState {
  globalLoading:       boolean;
  activeBottomTab:     string;
  setGlobalLoading:    (v: boolean) => void;
  setActiveBottomTab:  (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  globalLoading:      false,
  activeBottomTab:    "groups",
  setGlobalLoading:   (globalLoading) => set({ globalLoading }),
  setActiveBottomTab: (activeBottomTab) => set({ activeBottomTab }),
}));