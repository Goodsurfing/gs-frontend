import { Browser, BrowserContext, Page } from '@playwright/test';
import { mkdirSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_URL } from '../../config';
import { E2eSession } from '../../support/session';

/**
 * Демо фичи — видео со сценарием на стейдже и скриншоты ключевых мест.
 * Каждая сцена — свой контекст браузера и свой файл видео; склейка в один
 * mp4 — scripts/demo-video.sh. Результат — e2e/demos/output/<фича>/ (не в git).
 */

export const VIEWPORT = { width: 1280, height: 800 };

export const outputDir = (feature: string) => {
    const dir = join(__dirname, '..', 'output', feature);
    mkdirSync(join(dir, 'scenes'), { recursive: true });
    mkdirSync(join(dir, 'shots'), { recursive: true });
    return dir;
};

export interface Scene {
    context: BrowserContext;
    page: Page;
    /** Закрыть сцену и сохранить видео под номером */
    finish: () => Promise<void>;
}

/** Новая сцена с записью видео. Сессия — вход пользователя (как в e2e: localStorage). */
export const startScene = async (
    browser: Browser,
    feature: string,
    index: number,
    { session, httpCredentials }: { session?: E2eSession; httpCredentials?: { username: string; password: string; origin: string } } = {},
): Promise<Scene> => {
    const dir = outputDir(feature);
    const tmp = join(dir, 'scenes', `tmp-${index}`);
    const context = await browser.newContext({
        viewport: VIEWPORT,
        recordVideo: { dir: tmp, size: VIEWPORT },
        ignoreHTTPSErrors: true,
        locale: 'ru-RU',
        httpCredentials,
    });
    await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
    if (session) {
        await context.addInitScript((s) => {
            if (!location.origin.includes('goodsurfing.org')) return;
            localStorage.setItem('user', JSON.stringify({ username: s.email }));
            localStorage.setItem('token', JSON.stringify(s.accessToken));
            localStorage.setItem('mercureToken', JSON.stringify(s.mercureToken));
            localStorage.setItem('roles', JSON.stringify(s.roles));
        }, session);
    }
    const page = await context.newPage();
    return {
        context,
        page,
        finish: async () => {
            await context.close();
            const file = readdirSync(tmp).find((name) => name.endsWith('.webm'));
            if (file) renameSync(join(tmp, file), join(dir, 'scenes', `${String(index).padStart(2, '0')}.webm`));
        },
    };
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Подпись внизу экрана: что сейчас происходит. Держится на экране ms
 * миллисекунд (чтобы успеть прочитать). После перехода на другую страницу
 * подпись пропадает — вызывать снова.
 */
export const say = async (page: Page, text: string, ms = 3000) => {
    await page.evaluate((caption) => {
        let box = document.getElementById('__demo_caption');
        if (!box) {
            box = document.createElement('div');
            box.id = '__demo_caption';
            box.setAttribute('style', [
                'position:fixed', 'left:50%', 'bottom:28px', 'transform:translateX(-50%)', 'z-index:2147483647',
                'max-width:1000px', 'padding:14px 22px', 'border-radius:12px', 'background:rgba(20,24,28,.88)',
                'color:#fff', 'font:500 20px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
                'text-align:center', 'box-shadow:0 6px 24px rgba(0,0,0,.25)', 'pointer-events:none',
            ].join(';'));
            document.body.appendChild(box);
        }
        box.textContent = caption;
    }, text);
    await pause(ms);
};

export const hideCaption = async (page: Page) => {
    await page.evaluate(() => document.getElementById('__demo_caption')?.remove());
};

/** Заставка сцены: крупный заголовок поверх страницы */
export const titleCard = async (page: Page, title: string, subtitle = '', ms = 3000) => {
    await page.setContent(`<!doctype html><html lang="ru"><body style="margin:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0f5f4b;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center">
        <div style="font-size:44px;font-weight:700;margin-bottom:16px">${title}</div>
        <div style="font-size:22px;opacity:.85;max-width:900px;line-height:1.4">${subtitle}</div>
    </body></html>`);
    await pause(ms);
};

/** Скриншот ключевого места (без подписи) */
export const shot = async (page: Page, feature: string, name: string) => {
    await hideCaption(page);
    await page.screenshot({ path: join(outputDir(feature), 'shots', `${name}.png`) });
};

/** Плавная прокрутка к элементу — в видео видно, куда смотреть */
export const scrollTo = async (page: Page, selector: string) => {
    await page.locator(selector).first().evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await pause(1200);
};

export { pause };
