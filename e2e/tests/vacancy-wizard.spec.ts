import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { expectPageWorks } from '../support/pageCheck';

/**
 * GS-214: хост создаёт вакансию — черновик появляется, все шаги мастера
 * открываются без ошибок. Черновик удаляется в конце, данные стейджа не копятся.
 * Заполнение полей шагов (адрес на карте, даты, категории, картинка) — следующая
 * итерация; здесь фиксируем, что мастер жив целиком.
 */
const STEPS = ['welcome', 'where', 'when', 'who-needs', 'description', 'what-to-do', 'conditions', 'finishing-touches'];

test.describe('Мастер вакансии — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    test('«Добавить вакансию» → черновик → все шаги мастера', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'один раз на прогон');
        test.setTimeout(120_000);

        await page.goto('/ru/host/my-offers');
        await page.getByRole('button', { name: 'Добавить вакансию' }).click();
        await page.waitForURL(/\/ru\/offers\/welcome\/\d+/, { timeout: 20_000 });
        const id = page.url().match(/welcome\/(\d+)/)?.[1];
        expect(id).toBeTruthy();

        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'));
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        try {
            for (const step of STEPS) {
                await expectPageWorks(page, `/ru/offers/${step}/${id}`);
            }
        } finally {
            const removed = await api.delete(`/api/v1/vacancy/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            expect(removed.ok(), `черновик ${id} не удалён: ${removed.status()}`).toBeTruthy();
            await api.dispose();
        }
    });
});
