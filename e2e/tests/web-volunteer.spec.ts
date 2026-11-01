import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/** Волонтёр из участников популярной вакансии. */
const findVolunteer = async (): Promise<{ id: string; name: string } | undefined> => {
    const api = await request.newContext();
    const list = await (await api.get(`${API_URL}/api/v1/vacancy?page=1&limit=5&sort=popularity:desc&fields=card`)).json();
    for (const offer of list?.data ?? []) {
        const people = await (await api.get(`${API_URL}/api/v1/profile/vacancy-participant/list/${offer.id}?page=1&limit=1`)).json();
        const person = people?.data?.[0];
        if (person) return { id: person.id, name: `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim() };
    }
    return undefined;
};

/** Новый фронт: публичная страница волонтёра (VolunteerPersonalPage старого фронта). */
test.describe('Новый фронт: страница волонтёра', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('карточка, разделы, noindex; отзывы и «Написать» гостю не показываются', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            const volunteer = await findVolunteer();
            test.skip(!volunteer, 'нет участников');
            const response = await page.goto(`/volunteers/${volunteer!.id}`);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            if (volunteer!.name) await expect(page.getByRole('heading', { level: 1 })).toContainText(volunteer!.name);
            await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
            for (const id of ['1', 'skills', '2']) await expect(page.locator(`[id="${id}"]`)).toBeAttached();
            await expect(page.locator('[id="3"]')).toHaveCount(0);
            await expect(page.getByRole('link', { name: 'Написать' })).toHaveCount(0);
        });

        test('несуществующий профиль — сообщение', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            await page.goto('/volunteers/00000000-0000-0000-0000-000000000000');
            await expect(page.getByText(/Произошла ошибка/)).toBeVisible();
        });
    });

    test('вошедший видит «Написать» и отзывы', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'только волонтёр');
        const volunteer = await findVolunteer();
        test.skip(!volunteer, 'нет участников');
        await page.goto(`/volunteers/${volunteer!.id}`);
        await expect(page.getByRole('main').getByRole('link', { name: 'Написать' }).first())
            .toHaveAttribute('href', /^\/messenger\/(\d+|create\?recipientVolunteer=)/, { timeout: 15_000 });
        await expect(page.locator('[id="3"]')).toBeAttached();
    });
});
