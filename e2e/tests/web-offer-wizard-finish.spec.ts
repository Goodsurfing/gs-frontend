import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: мастер вакансии, шаги «Что делать», «Условия», «Последние
 * штрихи» и публикация. Черновик создаётся через API у host@test.com и
 * удаляется в afterEach (при таймауте finally не доходит до конца — см.
 * vacancy-publish.spec.ts). Лимит бесплатных вакансий у host@test.com не
 * проверить — у него членство; окно лимита проверяется подменой ответа.
 */
test.describe('Новый фронт: мастер вакансии, последние шаги — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    let api: APIRequestContext | null = null;
    let headers: Record<string, string> = {};
    let id = '';

    const vacancy = async () => (await (await api!.get(`/api/v1/vacancy/${id}`, { headers })).json());

    const isNewFrontend = async (page: Page) => {
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
    };

    test.beforeEach(async ({ context, page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'мастер вакансии — у хоста');
        await enableNewFrontend(context);
        await page.goto('/');
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'));
        headers = { Authorization: `Bearer ${token}` };
        api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const created = await api.post('/api/v1/vacancies', { headers: { ...headers, Accept: 'application/json' }, multipart: { draft: '1' } });
        expect(created.ok(), `черновик не создан: ${created.status()}`).toBeTruthy();
        id = String((await created.json()).id);
    });

    test.afterEach(async () => {
        if (!api) return;
        const removed = id ? await api.delete(`/api/v1/vacancy/${id}`, { headers }) : null;
        await api.dispose();
        api = null;
        if (removed) expect(removed.ok(), `вакансия ${id} не удалена: ${removed.status()}`).toBeTruthy();
    });

    test('«Что делать»: навык, свой навык, часы, выходные сохраняются', async ({ page }) => {
        await page.goto(`/offers/what-to-do/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Расскажите, чем нужно будет заниматься' })).toBeVisible();

        await page.getByRole('button', { name: 'Вождение' }).click();
        await expect(page.getByRole('button', { name: 'Вождение' })).toHaveAttribute('aria-pressed', 'true');
        await page.getByRole('textbox', { name: 'Добавить навык' }).fill('Пайка');
        await page.getByRole('textbox', { name: 'Добавить навык' }).press('Enter');
        await expect(page.getByRole('textbox', { name: 'Пайка' })).toBeVisible();
        await page.getByRole('spinbutton', { name: 'Количество рабочих часов' }).fill('30');
        await page.getByRole('combobox', { name: 'Количество выходных дней в неделю' }).selectOption('1');
        await expect(page.getByText('У вас есть несохраненные изменения')).toBeVisible();

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно сохранены')).toBeVisible();
        await expect.poll(async () => {
            const todo = (await vacancy())?.whatToDo;
            return todo ? [todo.skills?.map((skill: { name: string }) => skill.name), todo.additionalSkills, todo.hour, todo.dayOff] : null;
        }, { timeout: 15_000 }).toEqual([['Вождение'], ['Пайка'], 30, 1]);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/offers/conditions/${id}`);
    });

    test('«Условия»: «Да» без выбора — ошибка; жильё, удобства, оплата сохраняются', async ({ page }) => {
        await page.goto(`/offers/conditions/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Чем вы готовы обеспечить волонтёра' })).toBeVisible();

        const housing = page.getByRole('switch', { name: 'Жилье' });
        if (!(await housing.isChecked())) await housing.check();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Вы не выбрали ни одного пункта').first()).toBeVisible();

        await page.getByRole('button', { name: 'Комната' }).click();
        for (const name of ['Питание', 'Оплачиваемый проезд']) {
            const section = page.getByRole('switch', { name });
            if (await section.isChecked()) await section.uncheck();
        }
        await expect(page.getByText('Вы не выбрали ни одного пункта')).toHaveCount(0);
        await page.getByRole('button', { name: 'Электричество' }).click();
        await page.getByRole('spinbutton', { name: 'Взносы волонтера' }).fill('500');
        await page.getByRole('combobox', { name: 'Оплата' }).selectOption('EUR');

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно сохранены')).toBeVisible();
        await expect.poll(async () => {
            const condition = (await vacancy())?.condition;
            return condition ? [condition.houses?.map((house: { name: string }) => house.name), condition.conveniences, condition.volunteerContributions, condition.currency] : null;
        }, { timeout: 15_000 }).toEqual([['Комната'], ['electricity'], 500, 'EUR']);
    });

    test('«Последние штрихи»: неполная вакансия не публикуется, окно лимита ведёт на членство', async ({ page }) => {
        await page.goto(`/offers/finishing-touches/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Требования к участнику' })).toBeVisible();

        await page.getByRole('button', { name: 'Можно с детьми' }).click();
        await page.getByRole('switch', { name: 'Принимать заявки только от проверенных участников' }).check();
        await page.getByRole('button', { name: 'Добавить вопрос' }).click();
        await page.getByRole('textbox', { name: 'Добавить вопрос 1' }).fill('Почему вы?');

        // Без названия, описания и адреса бэкенд публикацию отклоняет
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Опубликовать' }).click();
        await expect(page.getByText('Заполните название, описание и адрес вакансии перед публикацией.')).toBeVisible();
        await expect.poll(async () => {
            const finish = (await vacancy())?.finishingTouche;
            return finish ? [finish.additionalConditions, finish.onlyVerified, finish.questions] : null;
        }, { timeout: 15_000 }).toEqual([['allow-kids'], true, ['Почему вы?']]);

        // Лимит бесплатных вакансий: у host@test.com членство — ответ бэкенда подменяем
        const origin = new URL(page.url()).origin;
        // Запрос к API — с другого адреса: без CORS-заголовков (и ответа на предзапрос) браузер ответ не отдаст
        const cors = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': 'authorization, content-type, accept-language', 'access-control-allow-methods': 'PATCH, OPTIONS' };
        await page.route('**/toggle-status', (route) => (route.request().method() === 'OPTIONS'
            ? route.fulfill({ status: 204, headers: cors })
            : route.fulfill({
                status: 400,
                contentType: 'application/problem+json',
                headers: cors,
                body: JSON.stringify({ detail: 'Free account allows up to 1 published vacancy. Get a membership to publish without limits.', status: 400 }),
            })));
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Опубликовать' }).click();
        const limit = page.getByRole('dialog', { name: /Бесплатно можно опубликовать только 1 вакансию/ });
        await expect(limit).toBeVisible();
        await expect(limit.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/membership');
    });

    test('публикация заполненного черновика → активна, переход к списку вакансий', async ({ page }) => {
        // Название, описание и адрес — через API: шаги «Где» и «Описание» проверяют свои спеки
        const patched = await api!.patch(`/api/v1/vacancies/${id}`, {
            headers: { ...headers, 'Content-Type': 'application/merge-patch+json' },
            data: {
                where: { address: 'Казань, улица Баумана', latitude: 55.792422, longitude: 49.111534 },
                description: { title: `E2E публикация ${Date.now()}`, shortDescription: 'Коротко', description: 'Полное описание для проверки публикации.', categories: [], image: null },
            },
        });
        expect(patched.ok(), `черновик не заполнен: ${patched.status()}`).toBeTruthy();

        await page.goto(`/offers/finishing-touches/${id}`);
        await isNewFrontend(page);
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        const confirm = page.getByRole('dialog');
        await expect(confirm).toContainText('Вы уверены, что хотите опубликовать');
        await confirm.getByRole('button', { name: 'Опубликовать' }).click();
        await page.waitForURL(/\/host\/my-offers/, { timeout: 20_000 });
        await expect.poll(async () => (await vacancy())?.status ?? null, { timeout: 20_000 }).toBe('active');

        // Опубликованная: «Сохранить изменения», черновик недоступен
        await page.goto(`/offers/finishing-touches/${id}`);
        await expect(page.getByRole('button', { name: 'Сохранить изменения' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Сохранить в черновики' })).toBeDisabled();
    });
});
