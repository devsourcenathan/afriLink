import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '../stores/auth.store';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const api = $fetch.create({
        baseURL: config.public.apiBase as string,
        onRequest({ options }) {
            if (authStore.accessToken) {
                options.headers = options.headers || {};
                (options.headers as any).Authorization = `Bearer ${authStore.accessToken}`;
            }
        },
        async onResponseError({ request, response, options }) {
            if (response.status === 401) {
                if (request.toString().includes('/auth/refresh') || request.toString().includes('/auth/login') || request.toString().includes('/auth/logout')) {
                    authStore.clearAuth();
                    await nuxtApp.runWithContext(() => navigateTo('/auth/login'));
                    return;
                }

                try {
                    const res = await $fetch<{ accessToken: string; refreshToken: string; user?: any }>('/auth/refresh', {
                        baseURL: config.public.apiBase as string,
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${authStore.refreshToken}`
                        }
                    });

                    if (res && res.accessToken) {
                        authStore.setAuth({
                            user: res.user ?? authStore.currentUser,
                            accessToken: res.accessToken,
                            refreshToken: res.refreshToken
                        });

                        // Retry original request
                        options.headers = options.headers || {};
                        (options.headers as any).Authorization = `Bearer ${res.accessToken}`;
                        return $fetch(request, options as any);
                    }
                } catch (e) {
                    authStore.clearAuth();
                    await nuxtApp.runWithContext(() => navigateTo('/auth/login'));
                }
            }
        }
    });

    return {
        provide: {
            api
        }
    };
});
