import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCookie } from '#app';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<any>(null);
    const accessToken = useCookie<string | null>('access_token', { default: () => null });
    const refreshToken = useCookie<string | null>('refresh_token', { default: () => null });
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    // Getters
    // On vérifie uniquement le cookie pour ne pas déconnecter l'utilisateur
    // lors d'un refresh de page (le user est rechargé par le plugin auth.ts).
    const isAuthenticated = computed(() => !!accessToken.value);
    const currentUser = computed(() => user.value);

    // Actions
    function setAuth(data: { user: any; accessToken: string; refreshToken: string }) {
        user.value = data.user;
        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;
    }

    function updateUser(data: any) {
        user.value = { ...user.value, ...data };
    }

    function clearAuth() {
        user.value = null;
        accessToken.value = null;
        refreshToken.value = null;
    }

    return {
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        isAuthenticated,
        currentUser,
        setAuth,
        updateUser,
        clearAuth,
    };
});
