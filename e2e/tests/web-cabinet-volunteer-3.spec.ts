import { test, expect, type Page } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: кабинет волонтёра — «Мои статьи», «Написать в блог», правка статьи.
 * На стейдже ничего не публикуется: списки, загрузка обложки, создание,
 * публикация и удаление — через перехват запросов.
 */

const IMAGE = { id: 'e2e-cover', contentUrl: '/web/images/default-offer.png', thumbnails: null };
const article = (id: number, name: string, isActive: boolean) => ({
    id, slug: `e2e-${id}`, name, created: '1 ноября 2026', isActive, likeCount: 2, reviewCount: 1,
    description: '', image: IMAGE, blogCategories: [{ id: 18, name: 'Волонтёрство', color: '' }],
});

/** Категории блога — свои, чтобы не зависеть от справочника стейджа */
const CATEGORIES = [{ id: 18, name: 'Волонтёрство', color: '' }, { id: 19, name: 'E2E: путешествия', color: '#79c8ff' }];
const mockCategories = (page: Page) => page.route(/\/api\/v1\/blog-category(\?|$)/, (route) => route.fulfill({ json: CATEGORIES }));

/** Опубликованные и черновики — по признаку isActive в запросе */
const mockLists = async (page: Page, published: unknown[], drafts: unknown[]) => {
    await page.route(/\/api\/v1\/blog\?/, (route) => {
        const active = new URL(route.request().url()).searchParams.get('isActive') === 'true';
        const data = active ? published : drafts;
        return route.fulfill({ json: { data, pagination: { total: data.length, page: 1, limit: 10 } } });
    });
};

test.describe('Новый фронт: кабинет волонтёра — статьи', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка кабинета волонтёра');
        await enableNewFrontend(context);
    });

    test('мои статьи: опубликованные и черновики, меню карточки', async ({ page }) => {
        await mockLists(page, [article(901, 'E2E: опубликованная', true)], [article(902, 'E2E: черновик', false)]);
        const requests: { method: string; url: string; body: unknown }[] = [];
        await page.route(/\/api\/v1\/blog\/90\d(\/|$)/, (route) => {
            const request = route.request();
            requests.push({ method: request.method(), url: request.url(), body: request.postDataJSON() });
            return route.fulfill({ status: 200, json: {} });
        });

        const response = await page.goto('/volunteer/articles');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Мои статьи' })).toBeVisible();
        await expect(page.getByRole('link', { name: /E2E: опубликованная/ })).toHaveAttribute('href', '/blog/e2e-901');
        await expect(page.getByRole('heading', { name: 'Черновики' })).toBeVisible();
        await expect(page.getByRole('link', { name: /E2E: черновик/ })).toBeVisible();

        // У опубликованной нет «Опубликовать», у черновика — есть
        const menus = page.getByRole('button', { name: 'Действия со статьёй' });
        await menus.first().click();
        await expect(page.getByRole('menuitem', { name: 'Редактировать' })).toHaveAttribute('href', '/volunteer/articles/901');
        await expect(page.getByRole('menuitem', { name: 'Опубликовать' })).toHaveCount(0);
        await page.keyboard.press('Escape');
        // Следующее меню — только после того, как закрылось прежнее: иначе в DOM два меню сразу
        await expect(page.getByRole('menu')).toHaveCount(0);

        await menus.nth(1).click();
        await page.getByRole('menu').getByRole('menuitem', { name: 'Опубликовать' }).click();
        await expect(page.getByText('Статья опубликована')).toBeVisible();
        expect(requests).toContainEqual(expect.objectContaining({ method: 'PATCH', url: expect.stringContaining('/blog/902/toggle-active'), body: { isActive: true } }));

        await expect(page.getByRole('menu')).toHaveCount(0);
        await menus.nth(1).click();
        await page.getByRole('menu').getByRole('menuitem', { name: 'Удалить' }).click();
        await expect(page.getByText('Статья удалена')).toBeVisible();
        expect(requests).toContainEqual(expect.objectContaining({ method: 'DELETE', url: expect.stringMatching(/\/blog\/902$/) }));
    });

    test('мои статьи: пусто — приглашение создать первую', async ({ page }) => {
        await mockLists(page, [], []);
        await page.goto('/volunteer/articles');
        await expect(page.getByText('На данный момент у вас нет добавленных статей. Создайте свою первую статью')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Создать статью' })).toHaveAttribute('href', '/volunteer/create-article');
        await expect(page.getByRole('heading', { name: 'Черновики' })).toHaveCount(0);
    });

    test('написать в блог: проверки формы и сохранение в черновики', async ({ page }) => {
        await mockLists(page, [], []);
        await mockCategories(page);
        await page.route('**/api/v1/media_objects', (route) => route.fulfill({ json: IMAGE }));
        let created: unknown = null;
        await page.route('**/api/v1/blog', (route) => {
            if (route.request().method() !== 'POST') return route.fallback();
            created = route.request().postDataJSON();
            return route.fulfill({ json: {} });
        });

        const response = await page.goto('/volunteer/create-article');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Написать в блог' })).toBeVisible();
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        await expect(page.getByText('Загрузите обложку')).toBeVisible();
        await expect(page.getByText('Поле обязательно для заполнения')).toBeVisible();
        await expect(page.getByText('Выберите хотя бы одну категорию')).toBeVisible();

        await page.locator('input[type=file]').first().setInputFiles({ name: 'cover.png', mimeType: 'image/png', buffer: Buffer.from('e2e') });
        await expect(page.getByText('Загрузите обложку')).toHaveCount(0);
        await page.getByLabel('Название статьи').fill('Абв');
        await expect(page.getByText('Заголовок слишком короткий')).toBeVisible();
        await page.getByLabel('Название статьи').fill('E2E: статья из теста');
        await page.getByRole('group', { name: 'Категория статьи' }).getByRole('button', { name: 'E2E: путешествия' }).click();
        await page.getByRole('textbox', { name: 'text' }).fill('Текст статьи из теста');
        await page.getByRole('button', { name: 'bold' }).click();

        await page.getByRole('button', { name: 'Сохранить в черновики' }).click();
        await expect(page).toHaveURL(/\/volunteer\/articles$/);
        expect(created).toMatchObject({ name: 'E2E: статья из теста', imageId: 'e2e-cover', isActive: false, description: expect.stringContaining('Текст статьи из теста') });
        expect((created as { categoryIds: number[] }).categoryIds).toEqual([19]);
    });

    test('правка статьи: данные подставлены, публикация', async ({ page }) => {
        await mockCategories(page);
        await page.route(/\/api\/v1\/blog\/903\?/, (route) => route.fulfill({
            json: {
                id: 903, slug: 'e2e-903', name: 'E2E: правка', description: '<p>Старый текст</p>', isActive: false, created: '1 ноября 2026',
                isHasLike: false, isGudserfing: false, reviewCount: 0, likeCount: 0, image: IMAGE,
                blogCategoryResults: [{ id: 18, name: 'Волонтёрство', color: '' }], author: {},
            },
        }));
        let edited: unknown = null;
        await page.route('**/api/v1/blog/903', (route) => {
            edited = route.request().postDataJSON();
            return route.fulfill({ json: {} });
        });

        await page.goto('/volunteer/articles/903');
        await expect(page.getByRole('heading', { name: 'Редактировать статью' })).toBeVisible();
        await expect(page.getByLabel('Название статьи')).toHaveValue('E2E: правка');
        await expect(page.getByRole('textbox', { name: 'text' })).toContainText('Старый текст');
        await expect(page.getByRole('button', { name: 'Волонтёрство' })).toHaveAttribute('aria-pressed', 'true');
        await page.getByRole('button', { name: 'Опубликовать' }).click();
        await expect(page.getByText('Статья успешно обновлена и опубликована')).toBeVisible();
        expect(edited).toMatchObject({ name: 'E2E: правка', isActive: true, categoryIds: [18], imageId: 'e2e-cover' });
    });

    test('мои статьи: ошибка API — сообщение, а не приглашение создать первую', async ({ page }) => {
        await page.route(/\/api\/v1\/blog\?/, (route) => route.fulfill({ status: 500, body: '' }));
        await page.goto('/volunteer/articles');
        await expect(page.getByText('Не удалось загрузить статьи. Попробуйте обновить страницу')).toBeVisible();
        await expect(page.getByText('На данный момент у вас нет добавленных статей. Создайте свою первую статью')).toHaveCount(0);
    });

    test('правка статьи: не загрузилась — сообщение без формы', async ({ page }) => {
        await mockCategories(page);
        await page.route(/\/api\/v1\/blog\/904\?/, (route) => route.fulfill({ status: 500, body: '' }));
        let saved = false;
        await page.route('**/api/v1/blog/904', (route) => {
            saved = true;
            return route.fulfill({ json: {} });
        });

        await page.goto('/volunteer/articles/904');
        await expect(page.getByText('Не удалось загрузить статью. Попробуйте обновить страницу')).toBeVisible();
        await expect(page.getByLabel('Название статьи')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Опубликовать' })).toHaveCount(0);
        expect(saved).toBe(false);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('статьи волонтёра уводят на вход', async ({ page }) => {
            await page.goto('/volunteer/articles');
            await expect(page).toHaveURL(/\/signin/);
            await page.goto('/volunteer/create-article');
            await expect(page).toHaveURL(/\/signin/);
        });
    });
});
