export const ApiRoutes = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    // Add more routes here as features are developed
    USERS: {
        ME: '/users/me',
        AVATAR: '/users/me/avatar',
        PROVIDER_PROFILE: '/users/me/provider-profile',
        COMPANY_PROFILE: '/users/me/company-profile',
    }
} as const;
