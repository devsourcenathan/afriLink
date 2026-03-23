export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // If the user is already authenticated, redirect them away from auth pages (login/register)
    // usually to the dashboard or home page
    if (authStore.isAuthenticated) {
        return navigateTo('/dashboard', { replace: true });
    }
});
