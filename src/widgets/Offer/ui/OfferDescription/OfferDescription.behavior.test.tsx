import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OfferDescription } from "./OfferDescription";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/Offer", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/Offer")>();
    return {
        ...actual,
        InviteDescriptionForm: ({
            isLoadingGetData, isLoadingUpdateData, onComplete, onUploadImageGallery,
        }: any) => (
            <>
                <button
                    type="button"
                    disabled={isLoadingGetData || isLoadingUpdateData}
                    onClick={() => onComplete({
                        title: "Помощь на фестивале",
                        shortDescription: "Кратко",
                        fullDescription: "Полное описание",
                        coverImage: { id: "img1" },
                        category: ["cat1"],
                    })}
                >
                    submit-description
                </button>
                <button
                    type="button"
                    onClick={() => onUploadImageGallery(["g1", "g2"])}
                >
                    upload-gallery
                </button>
            </>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferDescription offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferDescription", () => {
    it("сохраняет описание вакансии и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, description: null }))),
            rest.patch("*/vacancy/description/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-description");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Данные успешно сохранены")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({ title: "Помощь на фестивале", imageId: "img1" });
    });

    it("показывает текст ошибки бэка при неудачном сохранении", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, description: null }))),
            rest.patch("*/vacancy/description/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "name: обязательное поле" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-description");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/name: обязательное поле/i)).toBeInTheDocument();
    });

    it("обновляет галерею изображений отдельной мутацией", async () => {
        let galleryBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, description: null }))),
            rest.patch("*/vacancy/image-gallery/42", async (req, res, ctx) => {
                galleryBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();
        await userEvent.click(await screen.findByText("upload-gallery"));

        expect(await screen.findByText("volunteer-gallery.Галерея успешно обновлена")).toBeInTheDocument();
        expect(galleryBody).toEqual({ galleryImageIds: ["g1", "g2"] });
    });

    it("показывает ошибку, если обновление галереи упало", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, description: null }))),
            rest.patch("*/vacancy/image-gallery/42", (req, res, ctx) => res(ctx.status(500))),
        );

        renderWidget();
        await userEvent.click(await screen.findByText("upload-gallery"));

        expect(await screen.findByText("volunteer-gallery.Произошла ошибка с обновлением галереи")).toBeInTheDocument();
    });
});
