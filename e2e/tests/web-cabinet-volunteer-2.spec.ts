import { test, expect, type Page } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Проекты без отзыва и отзывы: у vol@test.com на стейдже их нет — ответы API подменяются */
const PENDING = [
    { id: 101, name: 'E2E: проект без отзыва', address: 'Москва', applicationStatus: 'accepted', categories: [], image: null },
];
const MINE = { data: [{ id: 'm1', created: '01.10.2026', description: 'E2E: мой отзыв о проекте', images: [], rating: 5, vacancy: { id: 102, name: 'E2E: проект с отзывом', image: null } }], pagination: { total: 1, page: 1, limit: 20 } };
const ABOUT_ME = { data: [{ id: 'a1', created: '', description: 'E2E: отзыв о волонтёре', images: [], rating: 4, author: { id: 'u1', firstName: 'Анна', lastName: 'Петрова', city: 'Казань', country: 'Россия', image: null, isDelete: false } }], pagination: { total: 1, page: 1, limit: 20 } };

/** Справочник навыков: «Фотография» есть всегда, навыков немного — тест не зависит от справочника стейджа */
const SKILLS = [
    { id: 9001, name: 'Фотография', imagePath: '/uploads/e2e-skill.svg' },
    { id: 9002, name: 'E2E: готовка', imagePath: '/uploads/e2e-skill.svg' },
];
const OWN_LANGUAGE = { id: 77, language: 'English', languageLevel: 'advanced' };

/**
 * Профиль вошедшего подменяется поверх настоящего: навыков и видео мало, язык с
 * id — тест не зависит от того, что накопилось у vol@test.com на стейдже.
 */
const mockProfile = async (page: Page) => {
    await page.route('**/api/v1/profile', async (route) => {
        if (route.request().method() !== 'GET') return route.fallback();
        const response = await route.fetch();
        const json = await response.json();
        if (json?.volunteer) {
            json.volunteer = { ...json.volunteer, skills: [], languages: [OWN_LANGUAGE], additionalSkills: [], certificates: [] };
        }
        return route.fulfill({ response, json: { ...json, videoGallery: [], galleryImages: [] } });
    });
};

/** Запись в API перехватывается: тест не меняет данные стейджа */
const captureWrite = async (page: Page, pattern: string | RegExp, method: string) => {
    const bodies: unknown[] = [];
    await page.route(pattern, (route) => {
        if (route.request().method() !== method) return route.fallback();
        bodies.push(route.request().postDataJSON());
        return route.fulfill({ json: {} });
    });
    return bodies;
};

/** Новый фронт: кабинет волонтёра — отзывы, навыки, фото и видео. */
test.describe('Новый фронт: кабинет волонтёра (отзывы, навыки, галерея)', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка кабинета волонтёра');
        await enableNewFrontend(context);
    });

    test('отзывы: панели, проект без отзыва, отзыв с проверкой оценки', async ({ page }) => {
        await page.route('**/api/v1/volunteer/vacancy/without-review/list**', (route) => route.fulfill({ json: PENDING }));
        await page.route('**/api/v1/volunteer/vacancy/review/list**', (route) => route.fulfill({ json: MINE }));
        await page.route(/\/api\/v1\/review-volunteer(\?.*)?$/, (route) => route.fulfill({ json: ABOUT_ME }));
        const reviews = await captureWrite(page, '**/api/v1/review-vacancy', 'POST');

        const response = await page.goto('/volunteer/review');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Отзывы', exact: true })).toBeVisible();
        const offers = page.getByRole('region', { name: 'Отзывы о проектах' });
        const aboutMe = page.getByRole('region', { name: 'Отзывы о вас' });
        await expect(offers.getByText('Проекты, которые вы недавно посещали')).toBeVisible();
        await expect(offers.getByText('E2E: мой отзыв о проекте')).toBeVisible();
        await expect(aboutMe.getByText('E2E: отзыв о волонтёре')).toBeVisible();
        await expect(aboutMe.getByText('Анна Петрова')).toBeVisible();

        await offers.getByRole('button', { name: 'Добавить отзыв' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('E2E: проект без отзыва')).toBeVisible();
        await expect(dialog.getByText('Добавить фото')).toBeVisible();
        const send = dialog.getByRole('button', { name: 'Оставить отзыв' });
        await expect(send).toBeDisabled();
        await dialog.getByRole('radio', { name: '5' }).click();
        await dialog.getByLabel('Напишите ваш отзыв').fill('Отличный проект');
        await send.click();
        await expect(dialog.getByText('Ваш отзыв был отправлен')).toBeVisible();
        expect(reviews[0]).toMatchObject({ vacancyId: 101, rating: 5, description: 'Отличный проект', imageIds: [] });
    });

    test('отзывы: звезда из письма «Как всё прошло?» открывает окно с оценкой', async ({ page }) => {
        await page.route('**/api/v1/volunteer/vacancy/without-review/list**', (route) => route.fulfill({ json: PENDING }));
        await page.route('**/api/v1/volunteer/vacancy/review/list**', (route) => route.fulfill({ json: MINE }));
        await page.route(/\/api\/v1\/review-volunteer(\?.*)?$/, (route) => route.fulfill({ json: ABOUT_ME }));

        await page.goto('/volunteer/review?vacancy=101&rating=4');
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('E2E: проект без отзыва')).toBeVisible();
        await expect(dialog.getByRole('radio', { name: '4' })).toBeChecked();
        // Параметры убраны: после обновления окно снова не откроется
        await expect(page).toHaveURL(/\/volunteer\/review$/);
    });

    test('отзывы: пока фото загружается, отзыв не отправить; крестик отменяет загрузку', async ({ page }) => {
        await page.route('**/api/v1/volunteer/vacancy/without-review/list**', (route) => route.fulfill({ json: PENDING }));
        await page.route('**/api/v1/volunteer/vacancy/review/list**', (route) => route.fulfill({ json: MINE }));
        await page.route(/\/api\/v1\/review-volunteer(\?.*)?$/, (route) => route.fulfill({ json: ABOUT_ME }));
        const reviews = await captureWrite(page, '**/api/v1/review-vacancy', 'POST');
        // Первая загрузка «висит» (её отменяет крестик), вторая проходит
        let uploads = 0;
        await page.route('**/api/v1/media_objects', (route) => {
            if (route.request().method() !== 'POST') return route.fallback();
            uploads += 1;
            if (uploads === 1) return undefined;
            return route.fulfill({ json: { id: 'e2e-img', contentUrl: '/uploads/e2e.png', thumbnails: {} } });
        });
        const png = { name: 'e2e.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64') };

        await page.goto('/volunteer/review');
        await page.getByRole('region', { name: 'Отзывы о проектах' }).getByRole('button', { name: 'Добавить отзыв' }).click();
        const dialog = page.getByRole('dialog');
        const send = dialog.getByRole('button', { name: 'Оставить отзыв' });
        await dialog.getByRole('radio', { name: '5' }).click();
        await dialog.getByLabel('Напишите ваш отзыв').fill('Отличный проект');
        await expect(send).toBeEnabled();

        const file = dialog.locator('input[type=file]');
        await file.setInputFiles(png);
        await expect(dialog.getByRole('img', { name: 'e2e.png' })).toBeVisible();
        await expect(send).toBeDisabled();
        await dialog.getByRole('button', { name: 'Удалить' }).click();
        await expect(dialog.getByRole('img', { name: 'e2e.png' })).toHaveCount(0);
        await expect(send).toBeEnabled();

        await file.setInputFiles(png);
        await expect(dialog.getByRole('button', { name: /^Фото 1$/ })).toBeVisible();
        await expect(send).toBeEnabled();
        await send.click();
        await expect(dialog.getByText('Ваш отзыв был отправлен')).toBeVisible();
        expect(reviews[0]).toMatchObject({ vacancyId: 101, imageIds: ['e2e-img'] });
    });

    test('навыки: языки, навыки из справочника, сохранение', async ({ page }) => {
        await mockProfile(page);
        await page.route(/\/api\/v1\/skill(\?.*)?$/, (route) => route.fulfill({ json: SKILLS }));
        const saves = await captureWrite(page, '**/api/v1/volunteer', 'PATCH');
        const response = await page.goto('/volunteer/skills');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Навыки и умения' })).toBeVisible();

        // Без изменений не отправляется
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Нет изменений для сохранения')).toBeVisible();
        expect(saves).toHaveLength(0);

        const addLanguage = page.getByRole('button', { name: 'Добавить язык' });
        await expect(addLanguage).toBeDisabled();
        await page.getByLabel('Знание языков').first().selectOption({ label: 'Испанский' });
        await expect(addLanguage).toBeEnabled();
        await addLanguage.click();

        const skill = page.locator('button[aria-pressed]').filter({ hasText: 'Фотография' });
        await expect(skill).toHaveAttribute('aria-pressed', 'false');
        await skill.click();
        await expect(skill).toHaveAttribute('aria-pressed', 'true');

        // Свой навык: пробелы обрезаются, повтор не добавляется
        const ownSkill = page.getByRole('textbox', { name: 'Добавить навык' });
        await ownSkill.fill('  Сёрфинг  ');
        await ownSkill.press('Enter');
        await ownSkill.fill('сёрфинг');
        await ownSkill.press('Enter');
        await expect(page.getByRole('textbox', { name: /^Навыки которыми вы обладаете: / })).toHaveCount(1);

        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Данные успешно изменены')).toBeVisible();
        expect(saves).toHaveLength(1);
        const body = saves[0] as { languages: unknown[]; skillIds: number[]; additionalSkills: string[] };
        // Сохранённый язык — со своим id, новый — с id: null (как в старом фронте)
        expect(body.languages).toEqual([OWN_LANGUAGE, { id: null, language: 'Español', languageLevel: 'beginner' }]);
        expect(body.skillIds).toEqual([9001]);
        expect(body.additionalSkills).toEqual(['Сёрфинг']);
    });

    test('фото и видео: три раздела, проверка ссылки, добавление видео', async ({ page }) => {
        await mockProfile(page);
        const videos = await captureWrite(page, '**/api/v1/profile/video-gallery', 'PATCH');
        const response = await page.goto('/volunteer/gallery');
        expect(response?.status()).toBe(200);
        for (const title of ['Ваши фотографии', 'Видео о себе', 'Дипломы и сертификаты']) {
            await expect(page.getByRole('heading', { name: title })).toBeVisible();
        }
        await expect(page.getByText('Добавить фото')).toBeVisible();
        await expect(page.getByText('Добавить сертификат')).toBeVisible();

        const link = page.getByLabel('Ссылка на видео');
        const add = page.getByRole('button', { name: 'Добавить видео' });
        await link.fill('https://example.com/video');
        await expect(page.getByText('Введите корректный URL')).toBeVisible();
        await expect(add).toBeDisabled();
        await link.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        await add.click();
        await expect(page.getByText('Данные успешно изменены')).toBeVisible();
        expect((videos[0] as { videoGallery: string[] }).videoGallery).toEqual(['https://www.youtube.com/watch?v=dQw4w9WgXcQ']);
        await expect(link).toHaveValue('');
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('отзывы, навыки и галерея уводят на вход', async ({ page }) => {
            for (const path of ['/volunteer/review', '/volunteer/skills', '/volunteer/gallery']) {
                await page.goto(path);
                await expect(page).toHaveURL(/\/signin/);
            }
        });
    });
});
