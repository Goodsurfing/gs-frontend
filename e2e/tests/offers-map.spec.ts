import { test, expect } from '@playwright/test';

// Регрессионный тест на баг: CSS-фикс центрирования зум-контрола растянул
// .ymaps-2-1-79-controls-pane на всю карту с pointer-events: auto — этот
// прозрачный слой перехватывал все клики/драг, и карту вообще нельзя было
// подвинуть мышью (зум-кнопки при этом продолжали работать, что маскировало
// проблему при беглой проверке).
// Классы Яндекс.Карт содержат версию API (ymaps-2-1-79-…), а Яндекс обновляет
// 2.1.x сам — поэтому ищем по окончанию класса, без версии.
const ymaps = (suffix: string) => `[class*="ymaps-2-1-"][class$="-${suffix}"], [class*="ymaps-2-1-"][class*="-${suffix} "]`;

// Карта грузится со серверов Яндекса; из GitHub Actions (США) это бывает
// заметно дольше, чем локально. 28.10 кнопка зума появилась позже 5 с
// стандартного ожидания, и тест падал при живой карте.
const MAP_TIMEOUT = 20_000;

test.describe('Карта вакансий — интерактивность', () => {
    test.use({ storageState: 'e2e/.auth/vol.json' });

    // Не воспроизводится как поломка: Яндекс.Карты в headless-браузере не
    // двигаются от программной мыши ни на стейдже, ни на проде (27.10.2026),
    // проверено вручную в обычном браузере — см. отчёт. Пока помечено fixme,
    // чтобы не блокировать проверку выкатки.
    test.fixme('карту можно подвинуть мышью (drag/pan)', async ({ page }) => {
        await page.goto('/ru/offers-map');

        // .ymaps-2-1-79-map matches both an outer wrapper and Yandex's inner
        // map element — .first() is the outer one, whose box we want anyway.
        const map = page.locator(ymaps('map')).first();
        await expect(map).toBeVisible({ timeout: MAP_TIMEOUT });

        // .ymaps-2-1-79-ground-pane сам по себе всегда 0x0 (абсолютно
        // спозиционирован, реальный размер несут дочерние тайлы с
        // отрицательными отступами) — toBeVisible() тут не показатель,
        // читаем transform напрямую.
        const groundPane = page.locator(ymaps('ground-pane'));
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
        const map = page.locator(ymaps('map')).first();
        await expect(map).toBeVisible({ timeout: MAP_TIMEOUT });
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

        const zoomPlus = page.locator(ymaps('zoom__plus')).first();
        await expect(zoomPlus).toBeVisible({ timeout: MAP_TIMEOUT });
        // .click() сам провалится, если кнопку перекрывает другой элемент
        await zoomPlus.click();
    });
});
