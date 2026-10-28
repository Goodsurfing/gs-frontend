import { expect, Page, request } from '@playwright/test';
import { API_URL } from '../config';
import { e2eHeaders } from './testApi';

export interface E2eSession {
    email: string;
    password: string;
    accessToken: string;
    mercureToken: string;
    roles: string[];
}

/**
 * Одноразовый пользователь @test.local: сценарии, которые меняют данные,
 * не трогают общих vol@/host@. Ночной restore стейджа таких пользователей удаляет.
 */
export const createSession = async (
    prefix: string,
    { admin = false, volunteer = false } = {},
): Promise<E2eSession> => {
    const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
    try {
        const email = `e2e-${prefix}-${Date.now()}@test.local`;
        const password = 'E2eSession2026x';
        const created = await api.post('/api/test/create-user', {
            data: { email, password, admin },
            headers: e2eHeaders(),
        });
        expect(created.ok(), await created.text()).toBeTruthy();
        const login = await api.post('/api/v1/token', { data: { email, password } });
        expect(login.ok(), await login.text()).toBeTruthy();
        const { accessToken, mercureToken, roles } = await login.json();
        if (volunteer) {
            // Профиль волонтёра — без него нельзя откликаться и жертвовать в сборы
            const created2 = await api.post('/api/v1/personal/volunteer', {
                data: {}, headers: { Authorization: `Bearer ${accessToken}` },
            });
            expect(created2.ok(), await created2.text()).toBeTruthy();
        }
        return { email, password, accessToken, mercureToken, roles: roles ?? [] };
    } finally {
        await api.dispose();
    }
};

/** Вход в браузере — так же, как global-setup: приложение читает сессию из localStorage. */
export const useSessionInPage = async (page: Page, session: E2eSession) => {
    await page.addInitScript((s) => {
        localStorage.setItem('user', JSON.stringify({ username: s.email }));
        localStorage.setItem('token', JSON.stringify(s.accessToken));
        localStorage.setItem('mercureToken', JSON.stringify(s.mercureToken));
        localStorage.setItem('roles', JSON.stringify(s.roles));
    }, session);
};

export const authHeaders = (session: E2eSession) => ({ Authorization: `Bearer ${session.accessToken}` });
