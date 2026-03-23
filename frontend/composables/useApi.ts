import { defu } from 'defu';
import { useFetch, navigateTo, useRuntimeConfig } from '#imports';
import { useAuthStore } from '../stores/auth.store';

export function useApi<T>(url: string | (() => string), options: Parameters<typeof useFetch<T>>[1] = {}) {
    const authStore = useAuthStore();
    const config = useRuntimeConfig();

    const defaults: Parameters<typeof useFetch<T>>[1] = {
        baseURL: config.public.apiBase as string,
        // Optional: you can set another key here, or let Nuxt handle it automatically
        // as Nuxt auto-generates a key based on the URL and options

        onRequest({ options }) {
            // Set the Authorization header if we have an access token
            // Ensure headers object exists
            options.headers = options.headers || {};
            if (authStore.accessToken) {
                (options.headers as unknown as Record<string, string>).Authorization = `Bearer ${authStore.accessToken}`;
            }
        },

        onResponseError(context) {
            // Handle 401 Unauthorized globally
            if (context.response.status === 401) {
                // Here we could attempt to refresh the token, 
                // but for simplicity we log the user out and redirect.
                authStore.clearAuth();
                navigateTo('/auth/login', { replace: true });
            }
        }
    };

    // Deep merge defaults with provided options
    const params = defu(options, defaults);

    return useFetch(url, params);
}
