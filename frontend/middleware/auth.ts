export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        // Redirect to login page if attempting to access a protected route
        return navigateTo('/auth/login', { replace: true });
    }

    // Role-based protection can be added here later based on route meta
    // e.g. if (to.meta.requiresRole && authStore.user.role !== to.meta.requiresRole) { ... }
});
