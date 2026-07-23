import {
    describe, it, expect, vi,
} from "vitest";
import { getMediaContent } from "./getMediaContent";
import { Image } from "@/types/media";

vi.mock("../constants/api", () => ({
    BASE_URL: "https://api.example.org",
}));

const S3 = "https://storage.example.org/media";

const imageWithThumbnails: Image = {
    id: "img-1",
    contentUrl: `${S3}/original.jpg`,
    thumbnails: {
        large: `${S3}/thumbnails/large/original.webp`,
        medium: `${S3}/thumbnails/medium/original.webp`,
        small: `${S3}/thumbnails/small/original.webp`,
    },
};

const imageWithoutThumbnails: Image = {
    id: "img-2",
    contentUrl: `${S3}/no-thumbs.jpg`,
    thumbnails: null as unknown as Image["thumbnails"],
};

describe("getMediaContent", () => {
    it("возвращает undefined для пустого значения", () => {
        expect(getMediaContent(undefined)).toBeUndefined();
        expect(getMediaContent("")).toBeUndefined();
    });

    it("возвращает соответствующую миниатюру для SMALL/MEDIUM/LARGE", () => {
        expect(getMediaContent(imageWithThumbnails, "SMALL"))
            .toBe(`${S3}/thumbnails/small/original.webp`);
        expect(getMediaContent(imageWithThumbnails, "MEDIUM"))
            .toBe(`${S3}/thumbnails/medium/original.webp`);
        expect(getMediaContent(imageWithThumbnails, "LARGE"))
            .toBe(`${S3}/thumbnails/large/original.webp`);
    });

    it("возвращает оригинал при size=ORIGINAL и по умолчанию", () => {
        expect(getMediaContent(imageWithThumbnails, "ORIGINAL")).toBe(`${S3}/original.jpg`);
        expect(getMediaContent(imageWithThumbnails)).toBe(`${S3}/original.jpg`);
    });

    it("фолбэчится на оригинал, когда thumbnails отсутствуют (SVG, старые записи)", () => {
        expect(getMediaContent(imageWithoutThumbnails, "SMALL")).toBe(`${S3}/no-thumbs.jpg`);
        expect(getMediaContent(imageWithoutThumbnails, "LARGE")).toBe(`${S3}/no-thumbs.jpg`);
    });

    it("строка проходит как есть (абсолютный URL) — миниатюры недоступны by design", () => {
        expect(getMediaContent(`${S3}/direct.jpg`, "SMALL")).toBe(`${S3}/direct.jpg`);
    });

    it("относительный путь строкой достраивается до абсолютного через BASE_URL", () => {
        expect(getMediaContent("/media/rel.jpg")).toBe("https://api.example.org/media/rel.jpg");
        expect(getMediaContent("media/rel.jpg")).toBe("https://api.example.org/media/rel.jpg");
    });

    it("относительные thumbnail-URL тоже достраиваются до абсолютных", () => {
        const relativeImage: Image = {
            id: "img-3",
            contentUrl: "/media/x.jpg",
            thumbnails: {
                large: "/media/thumbnails/large/x.webp",
                medium: "/media/thumbnails/medium/x.webp",
                small: "/media/thumbnails/small/x.webp",
            },
        };
        expect(getMediaContent(relativeImage, "LARGE"))
            .toBe("https://api.example.org/media/thumbnails/large/x.webp");
    });
});
