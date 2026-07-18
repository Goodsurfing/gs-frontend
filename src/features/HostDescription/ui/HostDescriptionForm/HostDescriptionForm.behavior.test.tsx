import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { HostDescriptionForm } from "./HostDescriptionForm";

// HostDescriptionFormContent — большая композитная форма (аватар, адрес,
// соцсети, тип организации), не имеющая отдельной ценности для теста этого
// компонента — стабим пустым рендером, проверяем именно ветвление
// create/update + тосты + сброс sessionStorage внутри HostDescriptionForm.
vi.mock("../HostDescriptionFormContent/HostDescriptionFormContent", () => ({
    // Пробрасываем host дальше видимым текстом — по нему в тесте дожидаемся,
    // пока useGetMyHostQuery реально зарезолвится, прежде чем сабмитить форму
    // (иначе onSubmit уходит в ветку create/update по устаревшему getHost).
    HostDescriptionFormContent: ({ host }: { host?: { id: string } }) => (
        <span>{host ? `host-loaded:${host.id}` : "host-loading"}</span>
    ),
}));

type FormProps = Partial<React.ComponentProps<typeof HostDescriptionForm>>;

const renderForm = (props: FormProps = {}) => renderWithProviders(
    <MemoryRouter>
        <HostDescriptionForm
            isLoading={false}
            isError={false}
            profileRefetch={vi.fn()}
            {...props}
        />
    </MemoryRouter>,
);

describe("HostDescriptionForm", () => {
    it("без организации у профиля — сабмит создаёт новую организацию", async () => {
        let createdBody: unknown;
        const profileRefetch = vi.fn();
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(404))),
            rest.post("*/organizations", async (req, res, ctx) => {
                createdBody = await req.json();
                return res(ctx.status(201), ctx.json({ id: "h1", name: "", description: "" }));
            }),
        );

        renderForm({ host: null, profileRefetch });

        await userEvent.click(screen.getByText("hostDescription.Сохранить"));

        expect(await screen.findByText("hostDescription.Организация создана")).toBeInTheDocument();
        expect(createdBody).toMatchObject({ isActive: true, type: "ИП" });
        expect(profileRefetch).toHaveBeenCalled();
    });

    it("с существующей организацией — сабмит обновляет её по id", async () => {
        let updatedId: string | undefined;
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({
                    id: "h1", name: "Волонтёры", type: "НКО", address: "", description: "", shortDescription: "",
                }),
            )),
            rest.patch("*/organizations/:id", (req, res, ctx) => {
                updatedId = req.params.id as string;
                return res(ctx.status(200), ctx.json({ id: "h1" }));
            }),
        );

        renderForm({ host: "h1" });

        await screen.findByText("host-loaded:h1");
        await userEvent.click(screen.getByText("hostDescription.Сохранить"));

        expect(await screen.findByText("hostDescription.Данные успешно изменены")).toBeInTheDocument();
        expect(updatedId).toBe("h1");
    });

    it("показывает тост об ошибке, если сохранение упало", async () => {
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(404))),
            rest.post("*/organizations", (req, res, ctx) => res(ctx.status(500))),
        );

        renderForm({ host: null });

        await userEvent.click(screen.getByText("hostDescription.Сохранить"));

        expect(await screen.findByText("hostDescription.Произошла ошибка")).toBeInTheDocument();
    });

    it("isError=true — показывает сообщение вместо формы", () => {
        renderForm({ host: null, isError: true });

        expect(screen.getByText(
            "hostDescription.Произошла ошибка! Поробуйте перезагрузить страницу",
        )).toBeInTheDocument();
        expect(screen.queryByText("hostDescription.Сохранить")).not.toBeInTheDocument();
    });
});
