import { APIRequestContext, request } from '@playwright/test';
import { API_URL } from '../config';

/**
 * Почта стейджа уходит в Mailpit (GS-204), а не в настоящий SMTP — тесты
 * читают письма через его API. Логин и пароль — MAILPIT_USER /
 * MAILPIT_PASSWORD (секреты репозитория, локально — ~/.config/goodsurfing).
 */
export const MAILPIT_URL = process.env.MAILPIT_URL ?? `${API_URL}/mailpit`;
export const hasMailpit = () => !!process.env.MAILPIT_USER && !!process.env.MAILPIT_PASSWORD;

const client = async (): Promise<APIRequestContext> => request.newContext({
    baseURL: `${MAILPIT_URL}/`,
    ignoreHTTPSErrors: true,
    httpCredentials: {
        username: process.env.MAILPIT_USER ?? '',
        password: process.env.MAILPIT_PASSWORD ?? '',
    },
});

interface MailpitMessage {
    ID: string;
    Subject: string;
}

/** Ждёт письмо на адрес и возвращает его HTML. */
export const waitForEmail = async (to: string, timeoutMs = 60_000): Promise<{ subject: string; html: string }> => {
    const api = await client();
    try {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            const res = await api.get('api/v1/search', { params: { query: `to:"${to}"` } });
            if (res.ok()) {
                const { messages } = (await res.json()) as { messages: MailpitMessage[] };
                if (messages?.length) {
                    const message = await (await api.get(`api/v1/message/${messages[0].ID}`)).json();
                    return { subject: message.Subject, html: message.HTML };
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 2_000));
        }
        throw new Error(`Письмо на ${to} не пришло в Mailpit за ${timeoutMs / 1000} с`);
    } finally {
        await api.dispose();
    }
};

/** Адрес ссылки с заданным текстом из HTML письма. */
export const linkByText = (html: string, text: string): string => {
    const match = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
        .find(([, , label]) => label.replace(/<[^>]+>/g, '').includes(text));
    if (!match) throw new Error(`В письме нет ссылки «${text}»`);
    return match[1].replace(/&amp;/g, '&');
};
