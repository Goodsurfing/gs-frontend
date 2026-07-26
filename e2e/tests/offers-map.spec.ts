import { test, expect } from '@playwright/test';

// Регрессионный тест на баг: CSS-фикс центрирования зум-контрола растянул
// .ymaps-2-1-79-controls-pane на всю карту с pointer-events: auto — этот
// прозрачный слой перехватывал все клики/драг, и карту вообще нельзя было
// подвинуть мышью (зум-кнопки при этом продолжали работать, что маскировало
// проблему при беглой проверке).
test.describe('Карта вакансий — интерактивность', () => {
    test.use({ storageState: 'e2e/.auth/vol.json' });

    test('карту можно подвинуть мышью (drag/pan)', async ({ page }) => {
        await page.goto('/ru/offers-map');

        // .ymaps-2-1-79-map matches both an outer wrapper and Yandex's inner
        // map element — .first() is the outer one, whose box we want anyway.
        const map = page.locator('.ymaps-2-1-79-map').first();
        await expect(map).toBeVisible();

        // .ymaps-2-1-79-ground-pane сам по себе всегда 0x0 (абсолютно
        // спозиционирован, реальный размер несут дочерние тайлы с
        // отрицательными отступами) — toBeVisible() тут не показатель,
        // читаем transform напрямую.
        const groundPane = page.locator('.ymaps-2-1-79-ground-pane');
        await expect(groundPane).toBeAttached();

        const transformBefore = await groundPane.evaluate((el) => getComputedStyle(el).transform);

        const box = await map.boundingBox();
        if (!box) throw new Error('Не удалось получить размеры карты');
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX - 150, centerY - 80, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(300);

        const transformAfter = await groundPane.evaluate((el) => getComputedStyle(el).transform);

        // если карта не сдвинулась — значит, что-то поверх неё перехватывает mousedown/move
        expect(transformAfter).not.toBe(transformBefore);
    });

    test('в центре карты нет прозрачного слоя поверх неё', async ({ page }) => {
        await page.goto('/ru/offers-map');

        // .ymaps-2-1-79-map matches both an outer wrapper and Yandex's inner
        // map element — .first() is the outer one, whose box we want anyway.
        const map = page.locator('.ymaps-2-1-79-map').first();
        const box = await map.boundingBox();
        if (!box) throw new Error('Не удалось получить размеры карты');

        const hitClassName = await page.evaluate(
            ({ x, y }) => document.elementFromPoint(x, y)?.className ?? null,
            { x: box.x + box.width / 2, y: box.y + box.height / 2 },
        );

        expect(hitClassName).not.toContain('controls-pane');
    });

    test('зум-контрол остаётся кликабельным', async ({ page }) => {
        await page.goto('/ru/offers-map');

        const zoomPlus = page.locator('.ymaps-2-1-79-zoom__plus');
        await expect(zoomPlus).toBeVisible();
        // .click() сам провалится, если кнопку перекрывает другой элемент
        await zoomPlus.click();
    });
});
