export const APP_ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  MAIN: {
    DASHBOARD: '/',
    TRIPS: '/trips',
    TRIP_DETAIL: (id: string) => `/trips/${id}`,
    CALENDAR: '/calendar',
    GROUP: '/groups',
    GROUP_DETAIL: (id: string) => `/groups/${id}`,
  },
  PROFILE: {
    INDEX: '/profile',
    SETTINGS: '/profile/settings',
    BANK_ACCOUNTS: '/profile/banks',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USER_MANAGEMENT: '/admin/users',
  }
};