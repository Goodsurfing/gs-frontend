import { test, expect, request } from '@playwright/test';
import { API_URL, BASE_URL } from '../config';

// GS-213: публичные страницы отдают свои мета-теги, sitemap собран из базы.
test.describe('SEO — гость', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const head = (page: import('@playwright/test').Page, selector: string) => page
        .locator(`head ${selector}`).first();

    test('карта вакансий: свой title, description и hreflang', async ({ page }) => {
        await page.goto('/ru/offers-map');
        await expect(page).toHaveTitle(/Карта волонтёрских вакансий/);
        await expect(head(page, 'meta[name="description"]')).toHaveAttribute('content', /.{40,}/);
        await expect(page.locator('head link[rel="alternate"][hreflang="en"]'))
            .toHaveAttribute('href', `${BASE_URL}/en/offers-map`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    });

    test('вакансия: title и og:image из данных вакансии', async ({ page }) => {
        const api = await request.newContext();
        const res = await api.get(`${API_URL}/api/v1/vacancy?page=1&limit=1`);
        const id = (await res.json())?.data?.[0]?.id;
        test.skip(!id, 'нет опубликованных вакансий');

        await page.goto(`/en/offers/${id}`);
        await expect(page).not.toHaveTitle(/^GoodSurfing$/);
        await expect(head(page, 'meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//);
        await expect(head(page, 'link[rel="canonical"]')).toHaveAttribute('href', `${BASE_URL}/en/offers/${id}`);
    });

    test('sitemap: индекс и вакансии', async () => {
        const api = await request.newContext();
        const index = await api.get(`${BASE_URL}/sitemap.xml`);
        expect(index.ok()).toBeTruthy();
        expect(await index.text()).toContain('/sitemap-vacancies.xml');

        const vacancies = await api.get(`${BASE_URL}/sitemap-vacancies.xml`);
        expect(vacancies.ok()).toBeTruthy();
        expect(await vacancies.text()).toMatch(new RegExp(`<loc>${BASE_URL}/ru/offers/\\d+</loc>`));
    });
});
