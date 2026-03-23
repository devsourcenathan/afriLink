import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '../stores/auth.store';

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore();

    const publicPages = [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-email'
    ];

    const normalizedPath = to.path.replace(/\/$/, '') || '/';
    const isPublic = publicPages.includes(normalizedPath) || normalizedPath.startsWith('/api/');
    const isAuthenticated = authStore.isAuthenticated;

    if (!isPublic && !isAuthenticated) {
        return navigateTo('/auth/login', { replace: true });
    }

    if (isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
        return navigateTo('/dashboard', { replace: true });
    }
});
