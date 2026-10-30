import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { expectPageWorks } from '../support/pageCheck';

/**
 * GS-214: хост проходит мастер и публикует вакансию — основной путь хоста.
 * Название, описание, категория — через интерфейс; публикация — кнопкой
 * «Опубликовать». Вакансия удаляется в конце.
 */
test.describe('Публикация вакансии — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    // Удаление черновика — в afterEach, а не в finally: при таймауте теста
    // finally не доходит до конца, и брошенные черновики копились у тестового
    // хоста (56 штук за 29–30.10), вытесняя фикстуры со страницы списка.
    let cleanup: (() => Promise<void>) | null = null;
    test.afterEach(async () => {
        const run = cleanup;
        cleanup = null;
        await run?.();
    });

    test('мастер: адрес, описание, категория → «Опубликовать» → публичная страница', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'один раз на прогон');
        test.setTimeout(180_000);
        const title = `E2E публикация ${Date.now()}`;

        await page.goto('/host/my-offers');
        await page.getByRole('button', { name: 'Добавить вакансию' }).click();
        await page.waitForURL(/\/offers\/welcome\/\d+/, { timeout: 20_000 });
        const id = page.url().match(/welcome\/(\d+)/)?.[1] as string;
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'));
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const headers = { Authorization: `Bearer ${token}` };
        cleanup = async () => {
            const removed = await api.delete(`/api/v1/vacancy/${id}`, { headers });
            await api.dispose();
            expect(removed.ok(), `вакансия ${id} не удалена: ${removed.status()}`).toBeTruthy();
        };

        // Шаг «Где»
        await page.goto(`/offers/where/${id}`);
        // Адрес принимается только из подсказок геокодера (/api/v1/geocode)
        await page.getByLabel('Введите адрес').pressSequentially('Казань, Баумана', { delay: 60 });
        await page.getByRole('option').first().click();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect.poll(async () => {
            const v = await (await api.get(`/api/v1/vacancies/${id}`, { headers })).json();
            return v?.where?.address ?? null;
        }, { timeout: 15_000 }).toMatch(/Баумана/);

        // Шаг «Описание»
        await page.goto(`/offers/description/${id}`);
        await page.getByLabel('Название мероприятия').fill(title);
        await page.getByLabel('Краткое описание').fill('Короткое описание вакансии для проверки публикации.');
        await page.getByLabel('Полное описание').fill('Полное описание вакансии: что делать, условия, расписание. Создано e2e-тестом и удаляется после проверки.');
        await page.getByRole('button', { name: 'Заповедники и нац. парки' }).click();
        // Обложка обязательна, ширина не меньше 1280 px: снимок окна 1280×720 и есть такой PNG
        const cover = await page.screenshot();
        const uploaded = page.waitForResponse((r) => r.url().includes('/media_objects') && r.request().method() === 'POST');
        await page.locator('input[type="file"]').first().setInputFiles({
            name: 'cover-e2e.png', mimeType: 'image/png', buffer: cover,
        });
        expect((await uploaded).status()).toBe(201);
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect.poll(async () => {
            const v = await (await api.get(`/api/v1/vacancies/${id}`, { headers })).json();
            return v?.description?.title ?? null;
        }, { timeout: 15_000 }).toBe(title);

        // Публикация
        await page.goto(`/offers/finishing-touches/${id}`);
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        // Подтверждение в модальном окне. В старом фронте оно без role="dialog",
        // поэтому окно — самый вложенный блок с текстом вопроса и кнопкой «Отмена»
        const confirm = page.locator('div')
            .filter({ hasText: 'Вы уверены, что хотите опубликовать' })
            .filter({ has: page.getByRole('button', { name: 'Отмена' }) })
            .last();
        const toggled = page.waitForResponse((r) => r.url().includes('/toggle-status'));
        await confirm.getByRole('button', { name: 'Опубликовать' }).click();
        expect((await toggled).ok(), 'публикация отклонена бэкендом').toBeTruthy();
        await expect.poll(async () => {
            const v = await (await api.get(`/api/v1/vacancies/${id}`, { headers })).json();
            return v?.status ?? null;
        }, { timeout: 20_000 }).toBe('active');

        await expectPageWorks(page, `/offers/${id}`);
        await expect(page.getByText(title).first()).toBeVisible();
    });
});
