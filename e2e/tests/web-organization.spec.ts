import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/** Организация с вакансиями — из первой популярной вакансии каталога. */
const findOrganization = async (): Promise<{ id: string; name: string } | undefined> => {
    const api = await request.newContext();
    const list = await (await api.get(`${API_URL}/api/v1/vacancy?page=1&limit=1&sort=popularity:desc&fields=card`)).json();
    const offerId = list?.data?.[0]?.id;
    if (!offerId) return undefined;
    const offer = await (await api.get(`${API_URL}/api/v1/vacancy/${offerId}`)).json();
    return offer?.organization ? { id: offer.organization.id, name: offer.organization.name } : undefined;
};

/** Новый фронт: публичная страница организации (HostPersonalPage старого фронта). */
test.describe('Новый фронт: страница организации', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('карточка, разделы, вакансии ведут на страницу вакансии, «Написать» гостю не показывается', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            const organization = await findOrganization();
            test.skip(!organization, 'нет организаций');
            await page.setViewportSize({ width: 1280, height: 900 });
            const response = await page.goto(`/organizations/${organization!.id}`);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(organization!.name);
            for (const id of ['1', '2', '3', '4']) await expect(page.locator(`[id="${id}"]`)).toBeAttached();
            await expect(page).toHaveTitle(`${organization!.name} — GoodSurfing`);

            const card = page.locator('[id="2"] [role="link"]').first();
            await expect(card).toBeVisible();
            await card.click();
            await expect(page).toHaveURL(/\/offers\/\d+$/);

            await page.goBack();
            await expect(page.getByRole('link', { name: 'Написать' })).toHaveCount(0);
        });
    });

    test('волонтёр видит «Написать» — ссылку в сообщения', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'только волонтёр');
        const organization = await findOrganization();
        test.skip(!organization, 'нет организаций');
        await page.goto(`/organizations/${organization!.id}`);
        await expect(page.getByRole('main').getByRole('link', { name: 'Написать' }).first())
            .toHaveAttribute('href', /^\/messenger\/(\d+|create\?recipientVolunteer=)/, { timeout: 15_000 });
    });
});
