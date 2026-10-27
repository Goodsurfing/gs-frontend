import { chromium, request } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { BASE_URL, API_URL } from './config';

const AUTH_DIR = path.join(__dirname, '.auth');

const ACCOUNTS = [
    { name: 'vol',  email: 'vol@test.com',  password: 'Test1234!' },
    { name: 'host', email: 'host@test.com', password: 'Test1234!' },
] as const;

async function setup(): Promise<void> {
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    // Сброс БД до чистого состояния
    const api = await request.newContext({
        baseURL: API_URL,
        ignoreHTTPSErrors: true,
    });

    const resetResp = await api.post('/api/test/reset');
    if (!resetResp.ok()) {
        throw new Error(`/api/test/reset вернул ${resetResp.status()}: ${await resetResp.text()}`);
    }

    await api.dispose();

    // Логин под каждым аккаунтом и сохранение storageState
    const browser = await chromium.launch();

    for (const account of ACCOUNTS) {
        const ctx = await browser.newContext({
            baseURL: BASE_URL,
                ignoreHTTPSErrors: true,
        });

        // Получаем JWT через API
        const loginResp = await ctx.request.post(`${API_URL}/api/v1/token`, {
            data: { email: account.email, password: account.password },
        });

        if (!loginResp.ok()) {
            throw new Error(`Логин ${account.email} не удался: ${loginResp.status()}`);
        }

        const { accessToken, mercureToken, roles } = await loginResp.json();

        // Записываем токен в localStorage так, как ожидает приложение —
        // userSlice.initAuthData() хидрирует authData только если ВСЕ
        // четыре ключа на месте (user/token/mercureToken/roles), иначе
        // PrivateRouteGuard считает сессию разлогиненной и уводит на
        // /signin, даже если JWT в localStorage валидный.
        await ctx.addInitScript(
            ({
                email, t, mt, r,
            }: {
                email: string; t: string; mt: string; r: string[];
            }) => {
                localStorage.setItem('user', JSON.stringify({ username: email }));
                localStorage.setItem('token', JSON.stringify(t));
                localStorage.setItem('mercureToken', JSON.stringify(mt));
                localStorage.setItem('roles', JSON.stringify(r));
            },
            {
                email: account.email, t: accessToken, mt: mercureToken, r: roles ?? [],
            },
        );

        // Открываем главную, чтобы localStorage "осел" в origin
        await ctx.newPage().then(p => p.goto(BASE_URL, { waitUntil: 'commit' }));

        await ctx.storageState({ path: path.join(AUTH_DIR, `${account.name}.json`) });
        await ctx.close();
    }

    await browser.close();
}

export default setup;
