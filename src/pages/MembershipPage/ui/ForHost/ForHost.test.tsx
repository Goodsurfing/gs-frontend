import {
    describe, it, expect, vi,
} from "vitest";
import { render } from "@testing-library/react";
import { ForHost } from "./ForHost";

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
    useAuth: () => ({ isAuth: false }),
}));

vi.mock("@/store/api/membershipApi", () => ({
    useGetTariffsQuery: () => ({ data: undefined }),
}));

/**
 * Регресс-guard (ROW 70): у секции членства организатора не было
 * id-якоря, из-за чего ссылки вида /membership#host (с рабочего стола
 * хоста и с international-сайта) не прокручивали к нужному блоку.
 * У соседних секций якоря есть: ForVolunteer id="tariffs",
 * InternationalClub id="international".
 */
describe("ForHost", () => {
    it("секция имеет id=\"host\" для якорной навигации", () => {
        const { container } = render(<ForHost />);
        expect(container.querySelector("section#host")).not.toBeNull();
    });
});
