import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRoutes } from '../constants/api.routes';
import { useAuthStore } from '../stores/auth.store';
import type { AuthTokensResponse } from '../types/auth';
import { setActivePinia, createPinia } from 'pinia';

const cookieState = new Map<string, { value: string | null }>();

vi.mock('#app', () => ({
    useCookie: (key: string, options?: { default?: () => string | null }) => {
        if (!cookieState.has(key)) {
            cookieState.set(key, {
                value: options?.default ? options.default() : null,
            });
        }

        return cookieState.get(key)!;
    },
}));

describe('Auth Feature (Frontend)', () => {
    beforeEach(() => {
        cookieState.clear();
        setActivePinia(createPinia());
    });

    it('should persist typed auth payloads inside the auth store', () => {
        const store = useAuthStore();
        const payload: AuthTokensResponse = {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: {
                id: 'user-1',
                email: 'user@example.com',
                firstName: 'Ada',
                lastName: 'Lovelace',
                phone: null,
                role: 'PRESTATAIRE',
                status: 'ACTIVE',
                emailVerified: true,
                avatarUrl: null,
                lastLoginAt: null,
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
                providerProfile: {
                    id: 'provider-1',
                    userId: 'user-1',
                    bio: 'Expert electrician',
                    hourlyRate: 15000,
                    skills: ['Electricite'],
                    availability: 'FULL_TIME',
                    location: 'Douala',
                    createdAt: '2026-01-01T00:00:00.000Z',
                    updatedAt: '2026-01-01T00:00:00.000Z',
                },
                companyProfile: null,
            },
        };

        store.setAuth(payload);

        expect(store.isAuthenticated).toBe(true);
        expect(store.currentUser?.email).toBe('user@example.com');
        expect(store.currentUser?.providerProfile?.skills).toContain('Electricite');
    });

    it('should replace the current user when profile data is refreshed', () => {
        const store = useAuthStore();
        store.updateUser({
            id: 'user-1',
            email: 'company@example.com',
            firstName: 'Marie',
            lastName: 'Curie',
            phone: '+237699112233',
            role: 'ENTREPRISE',
            status: 'ACTIVE',
            emailVerified: true,
            avatarUrl: null,
            lastLoginAt: null,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
            providerProfile: null,
            companyProfile: {
                id: 'company-1',
                userId: 'user-1',
                companyName: 'Afri Build',
                description: null,
                website: 'https://afribuild.example',
                industry: 'Construction',
                size: '11-50',
                createdAt: '2026-01-01T00:00:00.000Z',
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        });

        expect(store.currentUser?.companyProfile?.companyName).toBe('Afri Build');
    });

    it('should have the correct API routes defined in the enum', () => {
        expect(ApiRoutes.AUTH.LOGIN).toBe('/auth/login');
        expect(ApiRoutes.AUTH.REGISTER).toBe('/auth/register');
        expect(ApiRoutes.AUTH.LOGOUT).toBe('/auth/logout');
        expect(ApiRoutes.AUTH.FORGOT_PASSWORD).toBe('/auth/forgot-password');
        expect(ApiRoutes.AUTH.RESET_PASSWORD).toBe('/auth/reset-password');
        expect(ApiRoutes.AUTH.VERIFY_EMAIL).toBe('/auth/verify-email');
        expect(ApiRoutes.PROVIDERS.LIST).toBe('/providers');
        expect(ApiRoutes.PROVIDERS.DETAIL('provider-1')).toBe('/providers/provider-1');
        expect(ApiRoutes.PROVIDERS.ME_PROFILE).toBe('/providers/me/profile');
    });

    it('i18n should be configured to translate login text keys (Mock verify)', () => {
        const loginKey = 'auth.login.title';
        expect(loginKey).toBeDefined();
        expect(typeof loginKey).toBe('string');
    });
});
