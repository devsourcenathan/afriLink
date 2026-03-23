/**
 * Plugin d'hydratation de l'authentification.
 * 
 * Au démarrage, si un 'access_token' cookie est trouvé mais que le store Pinia
 * est vide (ex: après un rafraîchissement de page), ce plugin appelle GET /users/me
 * pour re-populer le store et ainsi laisse l'utilisateur rester connecté.
 */
import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '../stores/auth.store';
import { useRuntimeConfig } from '#imports';

export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    // Si le token existe en cookie mais que l'utilisateur n'est pas chargé en mémoire
    if (authStore.accessToken && !authStore.user) {
        try {
            const user = await $fetch<any>('/users/me', {
                baseURL: config.public.apiBase as string,
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`
                }
            });

            if (user) {
                // On réhydrate le store avec les données utilisateur
                authStore.updateUser(user);
            }
        } catch (error: any) {
            // Si le token est invalide/expiré, on tente un refresh
            if (error?.statusCode === 401 && authStore.refreshToken) {
                try {
                    const res = await $fetch<{ accessToken: string; refreshToken: string; user?: any }>('/auth/refresh', {
                        baseURL: config.public.apiBase as string,
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.refreshToken}`
                        }
                    });

                    if (res?.accessToken) {
                        authStore.setAuth({
                            user: res.user,
                            accessToken: res.accessToken,
                            refreshToken: res.refreshToken
                        });

                        // Recharger les infos user après refresh
                        const user = await $fetch<any>('/users/me', {
                            baseURL: config.public.apiBase as string,
                            headers: {
                                Authorization: `Bearer ${res.accessToken}`
                            }
                        });
                        if (user) authStore.updateUser(user);
                    }
                } catch {
                    // Refresh échoué : on déconnecte proprement
                    authStore.clearAuth();
                }
            } else {
                authStore.clearAuth();
            }
        }
    }
});
