import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { Footer } from "./Footer";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ myProfile: null }),
}));

vi.mock("@/widgets/ChangeLanguage", () => ({
    ChangeLanguage: () => null,
}));

/**
 * Регресс-тест для PR gs-frontend#344 (v0.1.21): половина ссылок в футере
 * вела на старый неактуальный сайт (community.goodsurfing.org). Заменены на
 * внутренние роуты через хелперы из AppUrls.
 */
describe("Footer", () => {
    it("ссылки блога/видео/амбассадоров/академии ведут на внутренние роуты, а не на community.goodsurfing.org", () => {
        renderWithProviders(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );

        const allLinks = screen.getAllByRole("link").map((el) => el.getAttribute("href"));

        const externalCommunityLinks = allLinks.filter(
            (href) => href?.includes("community.goodsurfing.org"),
        );
        expect(externalCommunityLinks).toHaveLength(0);

        expect(allLinks).toContain("/ru/blog");
        expect(allLinks).toContain("/ru/video");
    });
});
