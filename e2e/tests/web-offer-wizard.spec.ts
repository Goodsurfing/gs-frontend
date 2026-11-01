import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: мастер вакансии, шаги «Привет», «Где», «Когда», «Кто нужен»,
 * «Описание». Черновик
 * создаётся через API у host@test.com и удаляется после теста (в afterEach:
 * при таймауте finally не доходит до конца — см. vacancy-publish.spec.ts).
 */
test.describe('Новый фронт: мастер вакансии — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    let api: APIRequestContext | null = null;
    let headers: Record<string, string> = {};
    let id = '';

    const vacancy = async () => (await (await api!.get(`/api/v1/vacancies/${id}`, { headers: { ...headers, Accept: 'application/json' } })).json());

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
        if (removed) expect(removed.ok(), `черновик ${id} не удалён: ${removed.status()}`).toBeTruthy();
    });

    test('«Привет»: меню шагов, «Начать» ведёт на «Где»', async ({ page }) => {
        const response = await page.goto(`/offers/welcome/${id}`);
        expect(response?.status()).toBe(200);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Привет!' })).toBeVisible();
        for (const item of ['К вакансиям', 'Где', 'Когда', 'Кто нужен', 'Описание', 'Что делать', 'Условия', 'Последние штрихи']) {
            await expect(page.getByRole('link', { name: item, exact: true }).first()).toBeVisible();
        }
        await expect(page.getByRole('link', { name: 'Когда', exact: true }).first()).toHaveAttribute('href', `/offers/when/${id}`);
        await page.getByRole('link', { name: 'Начать' }).click();
        await expect(page).toHaveURL(new RegExp(`/offers/where/${id}$`));
    });

    test('«Где»: адрес только из подсказок геокодера, сохраняется в вакансию', async ({ page }) => {
        await page.goto(`/offers/where/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Где вы находитесь или будете принимать волонтеров' })).toBeVisible();

        const address = page.getByLabel('Введите адрес');
        await address.pressSequentially('Казань, Баумана', { delay: 60 });
        // Текст без выбора подсказки — не адрес
        await expect(page.getByText('Укажите пожалуйста адрес')).toBeVisible();
        await expect(page.getByText('У вас есть несохраненные изменения')).toBeVisible();
        await page.getByRole('option').first().click();
        await expect(page.getByText('Укажите пожалуйста адрес')).toHaveCount(0);

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Адрес успешно изменён')).toBeVisible();
        await expect(page.getByText('У вас есть несохраненные изменения')).toHaveCount(0);
        await expect.poll(async () => (await vacancy())?.where?.address ?? null, { timeout: 15_000 }).toMatch(/Баумана/);

        // После перезагрузки — сохранённый адрес
        await page.reload();
        await expect(address).toHaveValue(/Баумана/);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/offers/when/${id}`);
    });

    test('«Когда»: период, срок участия, «последний момент» сохраняются', async ({ page }) => {
        await page.goto(`/offers/when/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Укажите на какой срок или сроки вам нужен волонтер' })).toBeVisible();

        // Период: с 10-го по 20-е следующего месяца — через календарь
        await page.getByLabel('от', { exact: true }).first().click();
        await page.getByRole('button', { name: '›' }).first().click();
        await page.getByRole('button', { name: '10', exact: true }).first().click();
        await page.getByLabel('до', { exact: true }).first().click();
        await page.getByRole('button', { name: '›' }).first().click();
        await page.getByRole('button', { name: '20', exact: true }).first().click();
        await page.getByRole('button', { name: 'Добавить период' }).click();
        await expect(page.getByLabel('от', { exact: true })).toHaveCount(2);

        // Срок участия: «до» не может быть меньше «от»
        await page.getByRole('spinbutton', { name: 'Срок участия (от-до): от' }).fill('14');
        await page.getByRole('spinbutton', { name: 'Срок участия (от-до): до' }).fill('60');
        await expect(page.getByRole('slider', { name: 'Срок участия (от-до): до' })).toHaveAttribute('aria-valuetext', '1 месяц, 29 дней');

        // «Последний момент» снимает дату окончания приёма заявок
        await page.getByRole('switch', { name: 'Принимаю в последний момент' }).check();
        await expect(page.getByRole('switch', { name: 'Нет даты окончания' })).toBeChecked();

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно сохранены')).toBeVisible();
        await expect.poll(async () => {
            const when = (await vacancy())?.when;
            return when ? [when.periods?.length, when.durationMinDays, when.durationMaxDays, when.isApplicableAtTheEnd, when.applicationEndDate ?? null] : null;
        }, { timeout: 15_000 }).toEqual([1, 14, 60, true, null]);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/offers/who-needs/${id}`);
    });

    test('«Кто нужен»: пол и места обязательны, язык с уровнем сохраняется', async ({ page }) => {
        await page.goto(`/offers/who-needs/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Кого бы вы хотели видеть у себя в волонтерах' })).toBeVisible();

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Это поле является обязательным')).toHaveCount(2);

        await page.getByRole('switch', { name: 'Женщина' }).check();
        await page.getByRole('switch', { name: 'Мужчина' }).check();
        await page.getByRole('combobox', { name: 'Знание языков' }).first().click();
        await page.getByRole('option', { name: 'Английский' }).click();
        await page.getByRole('combobox', { name: 'Уровень владения' }).first().click();
        await page.getByRole('option', { name: 'Продвинутый' }).click();
        await page.getByRole('button', { name: 'Добавить язык' }).click();
        await page.getByLabel('Сколько волонтерских мест одновременно').fill('3');
        await page.getByRole('switch', { name: 'Только иностранцев' }).check();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно сохранены')).toBeVisible();
        await expect.poll(async () => {
            const h = (await vacancy())?.howNeeds;
            return h ? [h.gender?.length, h.volunteerPlaceCount, h.receptionPlace, h.requiredLanguages?.[0]?.language, h.requiredLanguages?.[0]?.languageLevel] : null;
        }, { timeout: 15_000 }).toEqual([2, 3, 'foreigners', 'English', 'advanced']);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/offers/description/${id}`);
    });

    test('«Описание»: обязательные поля, категория, обложка и фото сохраняются', async ({ page }) => {
        const title = `E2E описание ${Date.now()}`;
        await page.goto(`/offers/description/${id}`);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Описание вакансии' })).toBeVisible();

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Название вакансии не может быть пустым')).toBeVisible();
        await expect(page.getByText('Загрузите обложку')).toBeVisible();

        await page.getByLabel('Название мероприятия').fill(title);
        await page.getByRole('button', { name: 'Заповедники и нац. парки' }).click();
        await expect(page.getByRole('button', { name: 'Заповедники и нац. парки' })).toHaveAttribute('aria-pressed', 'true');
        await page.getByLabel('Краткое описание').fill('Короткое описание вакансии для проверки.');
        await page.getByLabel('Полное описание').fill('Полное описание вакансии. Создано e2e-тестом и удаляется после проверки.');

        // Обложка меньше 1280×720 не принимается; снимок окна 1280×720 — подходит
        const small = await page.screenshot({ clip: { x: 0, y: 0, width: 300, height: 200 } });
        await page.locator('input[type="file"]').first().setInputFiles({ name: 'small.png', mimeType: 'image/png', buffer: small });
        await expect(page.getByText('Неверный размер изображения. Минимум 1280x720')).toBeVisible();
        const cover = await page.screenshot();
        const uploaded = page.waitForResponse((r) => r.url().includes('/media_objects') && r.request().method() === 'POST');
        await page.locator('input[type="file"]').first().setInputFiles({ name: 'cover-e2e.png', mimeType: 'image/png', buffer: cover });
        expect((await uploaded).status()).toBe(201);
        await expect(page.getByText('Изменить')).toBeVisible();

        // Фото вакансии сохраняются сразу
        const gallery = page.waitForResponse((r) => r.url().includes('/image-gallery/'));
        await page.locator('input[type="file"]').nth(1).setInputFiles({ name: 'photo-e2e.png', mimeType: 'image/png', buffer: small });
        expect((await gallery).ok()).toBeTruthy();
        await expect(page.getByText('Галерея успешно обновлена')).toBeVisible();

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно сохранены')).toBeVisible();
        await expect.poll(async () => {
            const v = await (await api!.get(`/api/v1/vacancy/${id}`, { headers })).json();
            return [v?.description?.title, v?.description?.categories?.[0]?.name, !!v?.description?.image?.contentUrl, v?.galleryImages?.length];
        }, { timeout: 15_000 }).toEqual([title, 'Заповедники и нац. парки', true, 1]);
        await expect(page.getByRole('link', { name: 'Дальше' })).toHaveAttribute('href', `/offers/what-to-do/${id}`);
    });

    test('en: подписи переведены, адреса с префиксом', async ({ page }) => {
        await page.goto(`/en/offers/when/${id}`);
        await isNewFrontend(page);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Укажите на какой срок или сроки вам нужен волонтер');
        await expect(page.getByRole('link', { name: 'Where', exact: true }).first()).toHaveAttribute('href', `/en/offers/where/${id}`);
    });
});

test.describe('Новый фронт: мастер вакансии — гость', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('мастер уводит на вход', async ({ context, page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
        await page.goto('/offers/where/1');
        await expect(page).toHaveURL(/\/signin/);
    });
});
