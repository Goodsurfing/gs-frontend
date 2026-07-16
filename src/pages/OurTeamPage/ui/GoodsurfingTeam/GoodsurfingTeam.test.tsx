import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { GoodsurfingTeam } from "./GoodsurfingTeam";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const contentUrl = "https://storage.yandexcloud.net/gs-media-prod/media/original-2mb-photo.jpg";
const thumbnailUrl = "https://storage.yandexcloud.net/gs-media-prod/media/thumbnails/large/original-2mb-photo.webp";

vi.mock("@/entities/Admin", () => ({
    useGetOurTeamListQuery: () => ({
        data: {
            data: [{
                id: "1",
                firstName: "Милана",
                lastName: "Фурман",
                position: "Координатор",
                userId: null,
                vkontakte: null,
                telegram: null,
                image: {
                    id: "img-1",
                    contentUrl,
                    thumbnails: { large: thumbnailUrl, medium: thumbnailUrl, small: thumbnailUrl },
                },
            }],
        },
        isLoading: false,
    }),
}));

/**
 * Регресс-guard: карточки команды на /ru/our-team рендерили оригинал фото
 * (contentUrl) вместо превью — getMediaContent получал уже сузившуюся строку
 * item.image.contentUrl вместо полного объекта image, из-за чего встроенный
 * в getMediaContent выбор thumbnail никогда не срабатывал. На проде это
 * приводило к загрузке фото по 1-2.4 МБ на маленькую 180×180 карточку.
 */
describe("GoodsurfingTeam", () => {
    it("рендерит превью (thumbnails.large), а не оригинал фото", () => {
        render(<GoodsurfingTeam />);

        const img = screen.getByRole("img") as HTMLImageElement;
        expect(img.src).toBe(thumbnailUrl);
        expect(img.src).not.toBe(contentUrl);
    });
});
