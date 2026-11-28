import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: рабочий стол организатора и заявки (поиск, вкладки, карточки — GS-331). */
test.describe('Новый фронт: рабочий стол и заявки организатора', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        await enableNewFrontend(context);
    });

    test('рабочий стол: заполненность, заявки, уведомления', async ({ page }) => {
        const response = await page.goto('/host/host-dashboard');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('link', { name: 'Редактировать профиль' })).toHaveAttribute('href', '/host/info');
        await expect(page.getByRole('heading', { name: 'Заявки' })).toBeVisible();
        await expect(page.getByText(/Новых заявок: \d+/)).toBeVisible();
        // Есть новые — наверху «N новых заявок ждут ответа → Ответить» на вкладку «Новые»
        const banner = page.getByTestId('new-applications-banner');
        if (await banner.count()) await expect(banner.getByRole('link', { name: /Ответить/ })).toHaveAttribute('href', '/host/notes?status=new');
        await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
        await expect(page.getByText('Добро пожаловать!')).toBeVisible();
    });

    test('заявки: вкладки с числами, поиск по имени, карточка с вакансией и «Ответить» (GS-331)', async ({ page }) => {
        await page.goto('/host/notes?status=all');
        await expect(page.getByRole('heading', { name: 'Мои заявки' })).toBeVisible();
        await expect(page.getByLabel('Вакансия')).toHaveValue('');
        const tabs = page.getByRole('tablist');
        for (const name of ['Новые', 'Приняты', 'Отклонены', 'Все']) {
            // Число во вкладке — с сервера
            await expect(tabs.getByRole('tab', { name: new RegExp(`^${name}\\s*\\d+$`) })).toBeVisible();
        }
        await expect(tabs.getByRole('tab', { name: /^Все/ })).toHaveAttribute('aria-selected', 'true');

        const cards = page.getByTestId('application-card');
        await expect(cards.first().or(page.getByText('Пока нет заявок', { exact: false }))).toBeVisible();
        test.skip(!(await cards.count()), 'у организатора нет заявок');

        const first = cards.first();
        // Название вакансии — ссылкой на вакансию
        await expect(first.locator('a[href^="/offers/"]')).toBeVisible();

        // Поиск по имени первого волонтёра находит его карточку и пишется в адрес
        const name = (await first.getByRole('heading').textContent())?.trim().split(/\s+/)[0] ?? '';
        await page.getByLabel('Поиск по имени волонтёра').fill(name);
        await expect(page).toHaveURL(/[?&]q=/);
        await expect(cards.first().getByRole('heading')).toContainText(name);

        // Новая заявка: «Ответить» ведёт в переписку, «Отклонить» сначала спрашивает подтверждение
        await page.getByLabel('Поиск по имени волонтёра').fill('');
        await tabs.getByRole('tab', { name: /^Новые/ }).click();
        const fresh = cards.first();
        test.skip(!(await fresh.count()), 'нет новых заявок');
        const reply = fresh.getByRole('link', { name: 'Ответить' });
        if (await reply.count()) await expect(reply).toHaveAttribute('href', /^\/messenger\/\d+$/);
        let patched = false;
        page.on('request', (request) => {
            if (request.method() === 'PATCH' && request.url().includes('/application_forms/')) patched = true;
        });
        await fresh.getByRole('button', { name: 'Отклонить' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toContainText('Отклонить заявку?');
        await dialog.getByRole('button', { name: 'Отмена' }).click();
        await expect(dialog).toBeHidden();
        expect(patched).toBe(false);
    });
});
