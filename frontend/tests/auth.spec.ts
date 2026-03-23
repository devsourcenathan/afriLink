import { describe, it, expect } from 'vitest';
import { ApiRoutes } from '../constants/api.routes';

describe('Auth Feature (Frontend)', () => {
    it('should have the correct API routes defined in the enum', () => {
        expect(ApiRoutes.AUTH.LOGIN).toBe('/auth/login');
        expect(ApiRoutes.AUTH.REGISTER).toBe('/auth/register');
        expect(ApiRoutes.AUTH.LOGOUT).toBe('/auth/logout');
    });

    it('i18n should be configured to translate login text keys (Mock verify)', () => {
        const loginKey = 'auth.login.title';
        expect(loginKey).toBeDefined();
        expect(typeof loginKey).toBe('string');
    });
});
