import { describe, expect, it } from "vitest";

import { downscaleImage, outputType, renameForType, targetSize } from "../imageDownscale";

describe("targetSize", () => {
    it("уменьшает длинную сторону до 1920 с сохранением пропорций", () => {
        expect(targetSize(6000, 4500)).toEqual({ width: 1920, height: 1440 });
        expect(targetSize(3024, 4032)).toEqual({ width: 1440, height: 1920 });
    });

    it("не увеличивает маленькие", () => {
        expect(targetSize(800, 600)).toEqual({ width: 800, height: 600 });
        expect(targetSize(1920, 1080)).toEqual({ width: 1920, height: 1080 });
    });
});

describe("формат и имя", () => {
    it("PNG остаётся PNG, остальное — JPEG", () => {
        expect(outputType("image/png")).toBe("image/png");
        expect(outputType("image/webp")).toBe("image/jpeg");
        expect(outputType("image/jpeg")).toBe("image/jpeg");
    });

    it("меняет расширение под формат", () => {
        expect(renameForType("IMG_0001.webp", "image/jpeg")).toBe("IMG_0001.jpg");
        expect(renameForType("photo.JPEG", "image/jpeg")).toBe("photo.jpg");
        expect(renameForType("без расширения", "image/png")).toBe("без расширения.png");
    });
});

describe("downscaleImage", () => {
    it("GIF, SVG и PDF отдаёт как есть", async () => {
        for (const type of ["image/gif", "image/svg+xml", "application/pdf"]) {
            const file = new File(["x"], "f", { type });
            expect(await downscaleImage(file)).toBe(file);
        }
    });

    it("без поддержки браузера (нет createImageBitmap) отдаёт исходный файл", async () => {
        const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
        expect(await downscaleImage(file)).toBe(file);
    });
});
