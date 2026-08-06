import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

// Регресс-guard: src/shared/assets/images/membership/why.png весил 2.2МБ
// (несжатый PNG под фотографию 1448×1086) и грузился на КАЖДОЙ загрузке
// /membership — 40% всего веса страницы одной картинкой. Такие файлы
// невидимы в обычном ревью (diff показывает бинарник, не размер) и не
// ловятся типами/линтером — только явная проверка веса на CI.

const IMAGES_DIR = path.resolve(__dirname, ".");
const MAX_BYTES = 500 * 1024; // 500 КБ — с запасом выше типичного оптимизированного webp/jpg героя
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

function collectImageFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return collectImageFiles(fullPath);
        if (IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) return [fullPath];
        return [];
    });
}

describe("static image assets stay under the size budget", () => {
    const files = collectImageFiles(IMAGES_DIR);

    it("нашлись изображения для проверки (сам список не пуст)", () => {
        expect(files.length).toBeGreaterThan(0);
    });

    files.forEach((file) => {
        const relative = path.relative(IMAGES_DIR, file);
        it(`${relative} весит не больше ${MAX_BYTES / 1024} КБ`, () => {
            const { size } = fs.statSync(file);
            expect(
                size,
                `${relative} весит ${(size / 1024).toFixed(0)} КБ — сожми в webp/jpg перед коммитом`,
            ).toBeLessThanOrEqual(MAX_BYTES);
        });
    });
});
