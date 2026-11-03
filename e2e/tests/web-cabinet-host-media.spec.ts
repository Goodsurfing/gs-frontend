import { test, expect, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

// 1×1 PNG
const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC',
    'base64',
);

const accessToken = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null') as string | null);

/** Своя организация и восстановление полей после проверки (merge-patch) */
async function organization(page: Page) {
    const headers = { Authorization: `Bearer ${await accessToken(page)}` };
    const data = await page.request.get(`${API_URL}/api/v1/personal/organization`, { headers: { ...headers, Accept: 'application/json' } })
        .then((r) => r.json() as Promise<{ id: string; galleryImages?: { id: string }[]; videoGallery?: string[] }>);
    return {
        data,
        restore: (body: Record<string, unknown>) => page.request.patch(`${API_URL}/api/v1/organizations/${data.id}`, {
            headers: { ...headers, 'Content-Type': 'application/merge-patch+json' },
            data: body,
        }),
    };
}

/** Новый фронт: кабинет организатора — фото, видео, отзывы. */
test.describe('Новый фронт: фото, видео и отзывы организации', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        await enableNewFrontend(context);
    });

    test('«Фото»: загрузка добавляет фото, «×» убирает', async ({ page }) => {
        await page.goto('/host/gallery');
        await expect(page.getByRole('heading', { name: 'Фотогалерея организации' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Добавить фото' })).toBeVisible();
        const { data, restore } = await organization(page);
        const before = data.galleryImages?.length ?? 0;
        test.skip(before >= 10, 'галерея уже полная');
        try {
            await page.locator('input[type=file]').setInputFiles({ name: 'gallery-e2e.png', mimeType: 'image/png', buffer: PNG });
            await expect(page.getByText('Галерея успешно обновлена')).toBeVisible();
            await expect(page.locator('img[alt^="Фото "]')).toHaveCount(before + 1);
            await page.getByRole('button', { name: 'Удалить' }).last().click();
            await expect(page.locator('img[alt^="Фото "]')).toHaveCount(before);
        } finally {
            await restore({ galleryImages: (data.galleryImages ?? []).map((image) => `/api/v1/media_objects/${image.id}`) });
        }
    });

    test('«Видео»: неверная ссылка — сообщение, верная — плеер, удаление', async ({ page }) => {
        await page.goto('/host/video');
        await expect(page.getByRole('heading', { name: 'Видеогалерея организации' })).toBeVisible();
        const { data, restore } = await organization(page);
        const before = data.videoGallery?.length ?? 0;
        try {
            const link = page.getByLabel('Ссылка на видео');
            await link.fill('не ссылка');
            await page.getByRole('button', { name: 'Добавить видео' }).click();
            await expect(page.getByText('Введите корректный URL')).toBeVisible();
            await link.fill('https://vimeo.com/76979871');
            await page.getByRole('button', { name: 'Добавить видео' }).click();
            await expect(page.getByText('Данные успешно изменены')).toBeVisible();
            await expect(page.locator('iframe')).toHaveCount(before + 1);
            await page.getByRole('button', { name: 'Удалить' }).last().click();
            await expect(page.locator('iframe')).toHaveCount(before);
        } finally {
            await restore({ videoGallery: data.videoGallery ?? [] });
        }
    });

    test('«Отзывы»: колонки и окно отзыва о волонтёре (без отправки)', async ({ page }) => {
        await page.goto('/host/review');
        await expect(page.getByRole('heading', { name: 'Отзывы', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Отзывы про волонтёров' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Отзывы о проектах' })).toBeVisible();
        const add = page.getByRole('button', { name: 'Добавить отзыв' }).first();
        if (await add.count()) {
            await add.click();
            const dialog = page.getByRole('dialog');
            await expect(dialog).toBeVisible();
            await expect(dialog.getByText('Поставьте оценку, чтобы оставить отзыв')).toBeVisible();
            await expect(dialog.getByRole('button', { name: 'Оставить отзыв' })).toBeDisabled();
            await dialog.getByRole('radio', { name: '5' }).click();
            // Текст необязателен: одной оценки достаточно
            await expect(dialog.getByRole('button', { name: 'Оставить отзыв' })).toBeEnabled();
            await page.keyboard.press('Escape');
            await expect(dialog).toHaveCount(0);
        }
    });
});
