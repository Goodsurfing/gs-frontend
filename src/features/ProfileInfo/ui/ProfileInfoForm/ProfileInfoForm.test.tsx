import {
    describe, it, expect, vi,
} from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { Profile } from "@/entities/Profile";
import { ProfileInfoForm } from "./ProfileInfoForm";

const navigateMock = vi.fn();

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, opts?: string | { defaultValue?: string }) => {
            if (typeof opts === "string") {
                return opts;
            }
            return opts?.defaultValue ?? key;
        },
    }),
    initReactI18next: { type: "3rdParty", init: () => {} },
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => navigateMock };
});

const profile: Profile = {
    id: "1",
    email: "a@a.ru",
    locale: "ru",
    firstName: "Иван",
    lastName: "Иванов",
    gender: null,
    birthDate: null,
    country: null,
    city: null,
    phone: null,
    image: null,
    aboutMe: null,
    vk: null,
    facebook: null,
    instagram: null,
    telegram: null,
    hostId: null,
    volunteer: null,
    videoGallery: [],
    galleryImages: [],
    favoriteCategories: [],
    isActive: true,
    isVerified: false,
};

/**
 * Регресс-guard для rows 56/57: /profile/info раньше открывался в
 * read-only режиме (нужно было нажать «Редактировать»), и не было кнопки
 * перехода к следующему шагу («Дальше» → предпочтения). Фикс: PR
 * gs-frontend#331.
 */
describe("ProfileInfoForm", () => {
    it("row 56: форма открывается сразу в режиме редактирования", () => {
        renderWithProviders(
            <MemoryRouter>
                <ProfileInfoForm profile={profile} />
            </MemoryRouter>,
        );

        expect(screen.getByRole("button", { name: "info.Отмена" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "info.Сохранить" })).toBeEnabled();
    });

    it("row 57: кнопка «Дальше» ведёт к предпочтениям профиля", () => {
        renderWithProviders(
            <MemoryRouter>
                <ProfileInfoForm profile={profile} />
            </MemoryRouter>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Дальше" }));

        expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining("preferences"));
    });
});
