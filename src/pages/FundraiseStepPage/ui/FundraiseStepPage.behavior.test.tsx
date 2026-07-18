import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import FundraiseStepPage from "./FundraiseStepPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// "where"/"description" шаги делегируют в тяжёлые общие формы (карта,
// загрузка галереи) — здесь стабим их, чтобы проверять именно логику
// виджета (загрузка/сохранение/тост), а не саму форму.
vi.mock("@/features/Offer", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/Offer")>();
    return {
        ...actual,
        OfferWhereForm: ({ onComplete }: any) => (
            <button
                type="button"
                onClick={() => onComplete({
                    address: {
                        address: "Москва",
                        geoObject: { name: "Москва", description: "", Point: { pos: "37.6 55.7" } },
                    },
                })}
            >
                submit-where
            </button>
        ),
        InviteDescriptionForm: ({ onComplete }: any) => (
            <button
                type="button"
                onClick={() => onComplete({
                    title: "Заголовок",
                    shortDescription: "Кратко",
                    fullDescription: "Полно",
                    coverImage: { id: "img1" },
                    category: ["cat1"],
                })}
            >
                submit-description
            </button>
        ),
    };
});

const renderStep = (step: string, id = "42") => renderWithProviders(
    <MemoryRouter initialEntries={[`/ru/fundraise/${step}/${id}`]}>
        <Routes>
            <Route path="/:locale/fundraise/:step/:id" element={<FundraiseStepPage />} />
        </Routes>
    </MemoryRouter>,
);

// Кнопки/поля на всех шагах задизейблены, пока не отработает GET исходных
// данных (isLoading*) — ждём разблокировки, иначе клик/ввод по ещё
// задизейбленному элементу молча ничего не делает.
const clickWhenEnabled = async (text: string) => {
    const button = await screen.findByRole("button", { name: text });
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
};

describe("FundraiseStepPage — шаг where", () => {
    it("сохраняет адрес и показывает тост об успехе", async () => {
        server.use(
            rest.get("*/fundraise/address/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ address: "", longitude: null, latitude: null }),
            )),
            rest.patch("*/fundraise/address/:id", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
        );

        renderStep("where");
        await userEvent.click(await screen.findByText("submit-where"));

        expect(await screen.findByText("Адрес успешно сохранён")).toBeInTheDocument();
    });

    it("показывает текст ошибки, если сохранение адреса упало", async () => {
        server.use(
            rest.get("*/fundraise/address/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ address: "", longitude: null, latitude: null }),
            )),
            rest.patch("*/fundraise/address/:id", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "Некорректный адрес" }),
            )),
        );

        renderStep("where");
        await userEvent.click(await screen.findByText("submit-where"));

        expect(await screen.findByText(/Некорректный адрес/i)).toBeInTheDocument();
    });
});

describe("FundraiseStepPage — шаг when", () => {
    it("сохраняет дату окончания и переходит дальше по кнопке «Дальше»", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/fundraise/when/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ endDate: null, isUntilAmountCollected: false }),
            )),
            rest.patch("*/fundraise/when/:id", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderStep("when");

        expect(await screen.findByText(
            "Дата окончания приема пожертвований",
        )).toBeInTheDocument();
        await clickWhenEnabled("Сохранить");

        await waitFor(() => expect(screen.getByText(
            "Настройки срока сбора сохранены",
        )).toBeInTheDocument());
        expect(patchedBody).toMatchObject({ isUntilAmountCollected: false });
    });

    it("при «собирать до достижения минимума» блокирует поле даты", async () => {
        server.use(
            rest.get("*/fundraise/when/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ endDate: null, isUntilAmountCollected: false }),
            )),
            rest.patch("*/fundraise/when/:id", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
        );

        renderStep("when");

        await screen.findByText("Дата окончания приема пожертвований");
        const untilAmountLabel = screen.getByText(
            "Принимаю пожертвования до тех пор, пока минимальная сумма не будет собрана",
        );
        await waitFor(() => expect(screen.getByRole("button", { name: "Сохранить" })).not.toBeDisabled());
        await userEvent.click(untilAmountLabel);

        await waitFor(() => expect(
            screen.getByPlaceholderText("Не задано").className,
        ).toContain("disabled"));
    });
});

describe("FundraiseStepPage — шаг amount", () => {
    it("сохраняет суммы сбора", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/fundraise/how-many/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ amount: 0, minAmount: 0 }),
            )),
            rest.patch("*/fundraise/how-many/:id", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderStep("amount");

        await screen.findByText("Укажите желаемую сумму в рублях");
        await waitFor(() => expect(screen.getByRole("button", { name: "Сохранить" })).not.toBeDisabled());
        const [amountInput, minAmountInput] = screen.getAllByRole("textbox");
        await userEvent.type(amountInput, "50000");
        await userEvent.type(minAmountInput, "10000");
        await clickWhenEnabled("Сохранить");

        await waitFor(() => expect(screen.getByText(
            "Суммы сбора сохранены",
        )).toBeInTheDocument());
        expect(patchedBody).toEqual({ amount: 50000, minAmount: 10000 });
    });

    it("показывает ошибку бэка при неудачном сохранении суммы", async () => {
        server.use(
            rest.get("*/fundraise/how-many/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ amount: 0, minAmount: 0 }),
            )),
            rest.patch("*/fundraise/how-many/:id", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "amount: должна быть больше 0" }),
            )),
        );

        renderStep("amount");
        await clickWhenEnabled("Сохранить");

        expect(await screen.findByText(/amount: должна быть больше 0/i)).toBeInTheDocument();
    });
});

describe("FundraiseStepPage — шаг description", () => {
    it("сохраняет описание и показывает тост об успехе", async () => {
        server.use(
            rest.get("*/fundraise/description/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({
                    name: "", shortDescription: "", description: "", image: null, categoryIds: [],
                }),
            )),
            rest.patch("*/fundraise/description/:id", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
        );

        renderStep("description");
        await userEvent.click(await screen.findByText("submit-description"));

        expect(await screen.findByText("Описание сбора сохранено")).toBeInTheDocument();
    });
});

describe("FundraiseStepPage — шаг auto-messages", () => {
    it("требует слова благодарности перед публикацией", async () => {
        server.use(
            rest.get("*/fundraise/automatic-messages/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ wordsGratitude: "", urlProgressWork: [], status: "draft" }),
            )),
        );

        renderStep("auto-messages");
        await clickWhenEnabled("Опубликовать");

        expect(await screen.findByText(
            "Данное поле является обязательным",
        )).toBeInTheDocument();
    });

    it("публикует сбор при заполненных словах благодарности", async () => {
        let statusBody: unknown;
        server.use(
            rest.get("*/fundraise/automatic-messages/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ wordsGratitude: "", urlProgressWork: [], status: "draft" }),
            )),
            rest.patch("*/fundraise/automatic-messages/:id", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
            rest.patch("*/fundraise/toggle-status/:id", async (req, res, ctx) => {
                statusBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderStep("auto-messages");
        await screen.findByText("Слова благодарности");
        await waitFor(() => expect(screen.getByRole("button", { name: "Опубликовать" })).not.toBeDisabled());
        await userEvent.type(screen.getAllByRole("textbox")[0], "Спасибо!");
        await clickWhenEnabled("Опубликовать");

        await waitFor(() => expect(screen.getByText("Сбор опубликован")).toBeInTheDocument());
        expect(statusBody).toEqual({ status: "active" });
    });

    it("сохраняет черновик со статусом draft (не active)", async () => {
        let statusBody: unknown;
        server.use(
            rest.get("*/fundraise/automatic-messages/:id", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ wordsGratitude: "", urlProgressWork: [], status: "draft" }),
            )),
            rest.patch("*/fundraise/automatic-messages/:id", (req, res, ctx) => res(ctx.status(200), ctx.json({}))),
            rest.patch("*/fundraise/toggle-status/:id", async (req, res, ctx) => {
                statusBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderStep("auto-messages");
        await screen.findByText("Слова благодарности");
        await waitFor(() => expect(screen.getByRole("button", { name: "Сохранить в черновики" })).not.toBeDisabled());
        await userEvent.type(screen.getAllByRole("textbox")[0], "Спасибо!");
        await clickWhenEnabled("Сохранить в черновики");

        await waitFor(() => expect(screen.getByText("Сбор сохранён в черновики")).toBeInTheDocument());
        expect(statusBody).toEqual({ status: "draft" });
    });
});
