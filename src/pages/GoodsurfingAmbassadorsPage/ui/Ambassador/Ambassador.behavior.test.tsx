import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { Ambassador } from "./Ambassador";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const AMBASSADOR = {
    id: "a1",
    userId: "u1",
    firstName: "Иван",
    lastName: "Иванов",
    description: "Амбассадор",
    city: "Москва",
    country: "Россия",
    image: {
        id: "img1",
        contentUrl: "https://storage.yandexcloud.net/gs-media-prod/media/original-4mb.jpg",
        thumbnails: {
            small: "https://storage.yandexcloud.net/gs-media-prod/media/original-4mb.small.jpg",
            medium: "https://storage.yandexcloud.net/gs-media-prod/media/original-4mb.medium.jpg",
            large: "https://storage.yandexcloud.net/gs-media-prod/media/original-4mb.large.jpg",
        },
    },
};

describe("Ambassador — превью вместо оригинала", () => {
    it("грузит thumbnails.medium, а не многомегабайтный оригинал", async () => {
        server.use(
            rest.get("*/leader/list", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ data: [AMBASSADOR], pagination: { total: 1 } }),
            )),
        );

        renderWithProviders(
            <MemoryRouter>
                <Ambassador />
            </MemoryRouter>,
        );

        const img = await screen.findByRole("img");
        expect(img).toHaveAttribute("src", expect.stringContaining("original-4mb.medium.jpg"));
        expect(img.getAttribute("src")).not.toContain("original-4mb.jpg\"");
    });

    it("без thumbnails откатывается на оригинал (легаси-фото без миниатюр)", async () => {
        server.use(
            rest.get("*/leader/list", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({
                    data: [{
                        ...AMBASSADOR,
                        image: { id: "img2", contentUrl: "https://storage.yandexcloud.net/gs-media-prod/media/legacy.jpg" },
                    }],
                    pagination: { total: 1 },
                }),
            )),
        );

        renderWithProviders(
            <MemoryRouter>
                <Ambassador />
            </MemoryRouter>,
        );

        const img = await screen.findByRole("img");
        expect(img).toHaveAttribute("src", expect.stringContaining("legacy.jpg"));
    });
});
