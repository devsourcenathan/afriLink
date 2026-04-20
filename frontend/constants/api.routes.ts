export const ApiRoutes = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },
    // Add more routes here as features are developed
    USERS: {
        ME: '/users/me',
        AVATAR: '/users/me/avatar',
        PROVIDER_PROFILE: '/users/me/provider-profile',
        COMPANY_PROFILE: '/users/me/company-profile',
    },
    PROVIDERS: {
        LIST: '/providers',
        DETAIL: (id: string) => `/providers/${id}`,
        ME_PROFILE: '/providers/me/profile',
    },
    SERVICES: {
        LIST: '/services',
        DETAIL: (id: string) => `/services/${id}`,
        MINE: '/services/me',
        MINE_DETAIL: (id: string) => `/services/${id}/me`,
    },
    REQUESTS: {
        LIST: '/requests',
        DETAIL: (id: string) => `/requests/${id}`,
        MINE: '/requests/me',
        MINE_DETAIL: (id: string) => `/requests/${id}/me`,
    }
} as const;
