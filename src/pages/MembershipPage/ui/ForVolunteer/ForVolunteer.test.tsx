import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { ForVolunteer } from "./ForVolunteer";

const { mockProfile } = vi.hoisted(() => ({ mockProfile: vi.fn() }));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: true }),
}));

vi.mock("@/store/api/membershipApi", () => ({
    useGetTariffsQuery: () => ({ data: undefined }),
}));

vi.mock("@/entities/Profile", () => ({
    useGetProfileInfoQuery: () => mockProfile(),
}));

/**
 * gs-backend #421: волонтёрский тариф хостовых прав не даёт. Хосту на
 * странице членства об этом сказано заранее — купить тариф всё равно можно.
 */
describe("ForVolunteer — подсказка хосту", () => {
    beforeEach(() => mockProfile.mockReset());

    it("хосту показывает, что для вакансий и сборов нужен хостовый тариф", () => {
        mockProfile.mockReturnValue({ data: { hostId: "org-1" } });

        render(<ForVolunteer />);

        expect(screen.getByText(/больше одной вакансии/)).toBeTruthy();
        expect(screen.getByText("членство для организаторов").getAttribute("href")).toBe("#host");
        expect(screen.getByText("for-volunteer.Получить членство")).toBeTruthy();
    });

    it("волонтёру подсказку не показывает", () => {
        mockProfile.mockReturnValue({ data: { hostId: null } });

        render(<ForVolunteer />);

        expect(screen.queryByText(/больше одной вакансии/)).toBeNull();
    });
});
