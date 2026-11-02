import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: шаги мастера сбора «Где», «Когда», «Сколько», «Описание»,
 * «Настройка автоматических сообщений». Черновик сбора создаётся через API у
 * host@test.com и удаляется после теста; сбор не публикуется.
 */
test.describe('Новый фронт: мастер сбора — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    let api: APIRequestContext | null = null;
    let headers: Record<string, string> = {};
    let id = '';

    const step = async (name: string) => (await (await api!.get(`/api/v1/fundraise/${name}/${id}`, { headers })).json());

    const isNewFrontend = async (page: Page) => {
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
    };

    test.beforeEach(async ({ context, page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'мастер сбора — у хоста');
        await enableNewFrontend(context);
        await page.goto('/');
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'));
        headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
        api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const created = await api.post('/api/v1/fundraise', { headers });
        test.skip(!created.ok(), `черновик сбора не создан: ${created.status()}`);
        id = String((await created.json()).id);
    });

    test.afterEach(async () => {
        if (!api) return;
        const removed = id ? await api.delete(`/api/v1/fundraise/${id}`, { headers }) : null;
        await api.dispose();
        api = null;
        id = '';
        if (removed) expect(removed.ok(), `черновик сбора не удалён: ${removed.status()}`).toBeTruthy();
    });

    test('меню шагов и «Где»: адрес из подсказок геокодера сохраняется', async ({ page }) => {
        const response = await page.goto(`/fundraise/where/${id}`);
        expect(response?.status()).toBe(200);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Где будет проходить ваш проект' })).toBeVisible();
        for (const item of ['К сборам', 'Где', 'Когда', 'Сколько', 'Описание', 'Настройка автоматических сообщений']) {
            await expect(page.getByRole('link', { name: item, exact: true }).first()).toBeVisible();
        }

        await page.getByLabel('Введите адрес').pressSequentially('Казань, Баумана', { delay: 60 });
        await page.getByRole('option').first().click();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Адрес успешно сохранён')).toBeVisible();
        await expect.poll(async () => (await step('address'))?.address ?? null, { timeout: 15_000 }).toMatch(/Баумана/);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/fundraise/when/${id}`);
    });

    test('«Когда»: «до сбора минимальной суммы» сохраняется, «Дальше» ведёт на «Сколько»', async ({ page }) => {
        await page.goto(`/fundraise/when/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Укажите до какой даты вам нужно завершить сбор средств' })).toBeVisible();
        await page.getByText('Принимаю пожертвования до тех пор, пока минимальная сумма не будет собрана').click();
        await page.getByRole('button', { name: 'Дальше' }).click();
        await expect(page).toHaveURL(new RegExp(`/fundraise/amount/${id}$`));
        expect((await step('when')).isUntilAmountCollected).toBe(true);
    });

    test('«Сколько»: только цифры, суммы сохраняются', async ({ page }) => {
        await page.goto(`/fundraise/amount/${id}`);
        await isNewFrontend(page);
        const amount = page.getByLabel('Укажите желаемую сумму в рублях');
        await amount.fill('50 000 ₽');
        await expect(amount).toHaveValue('50000');
        await page.getByLabel('Укажите минимальную сумму в рублях, необходимую для проведения проекта').fill('20000');
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Суммы сбора сохранены')).toBeVisible();
        const saved = await step('how-many');
        expect([saved.amount, saved.minAmount]).toEqual([50000, 20000]);
    });

    test('«Описание»: пустая форма не сохраняется', async ({ page }) => {
        await page.goto(`/fundraise/description/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Описание приглашения' })).toBeVisible();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Загрузите обложку')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/fundraise/auto-messages/${id}`);
    });

    test('«Автоматические сообщения»: слова обязательны, ссылки и черновик сохраняются', async ({ page }) => {
        await page.goto(`/fundraise/auto-messages/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Настройка автоматических сообщений' })).toBeVisible();
        await page.getByRole('button', { name: 'Сохранить в черновики' }).click();
        await expect(page.getByText('Данное поле является обязательным')).toBeVisible();

        await page.getByLabel(/Вы можете написать слова благодарности/).fill('Спасибо за помощь!');
        await page.getByLabel('Добавить ссылку 1').fill('https://example.org/progress');
        await page.getByRole('button', { name: 'Добавить ссылку' }).click();
        await page.getByLabel('Добавить ссылку 2').fill('https://example.org/second');
        await page.getByRole('button', { name: 'Удалить' }).last().click();
        await page.getByRole('button', { name: 'Сохранить в черновики' }).click();
        await expect(page.getByText('Сбор сохранён в черновики')).toBeVisible();
        const saved = await step('automatic-messages');
        expect(saved.wordsGratitude).toBe('Спасибо за помощь!');
        expect(saved.urlProgressWork).toEqual(['https://example.org/progress']);
    });
});
