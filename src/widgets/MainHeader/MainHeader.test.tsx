import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import { render, waitFor } from "@testing-library/react";
import MainHeader from "./MainHeader";

let bannerDataMock: { url: string; description: string } | undefined;

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ myProfile: null, profileIsLoading: false, isAuth: false }),
}));

vi.mock("@/entities/Admin", () => ({
    BannerMarketingType: { UNDER_HEADER_ALL_PAGES: "UNDER_HEADER_ALL_PAGES" },
    useGetBannerMarketingQuery: () => ({ data: bannerDataMock }),
}));

vi.mock("@/components/LocaleLink/LocaleLink", () => ({
    default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("@/shared/ui/ButtonLink/ButtonLink", () => ({
    default: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

vi.mock("@/widgets/ChangeLanguage", () => ({
    ChangeLanguage: () => <div />,
}));

vi.mock("@/widgets/MobileHeader/ui/MobileHeader/MobileHeader", () => ({
    default: () => <div />,
}));

vi.mock("./MainHeaderNav/MainHeaderNav", () => ({
    MainHeaderNav: () => <nav />,
}));

vi.mock("./MainHeaderProfile/MainHeaderProfile", () => ({
    default: () => <div />,
}));

vi.mock("./MessangerInfo/MessangerInfo", () => ({
    MessangerInfo: () => <div />,
}));

/**
 * Регресс-guard: sticky-подменю на других страницах (offer/host/volunteer/
 * donation) читают CSS-переменную --header-offset, чтобы не заезжать под
 * плавающую шапку (капсула + опциональный промо-баннер под ней). Раньше у
 * них был захардкожен top: 6.5rem, который не учитывал появление баннера —
 * из-за этого подменю визуально сливалось с шапкой в «двойное меню».
 */
describe("MainHeader --header-offset", () => {
    let resizeObserverObserve: ReturnType<typeof vi.fn>;
    let resizeObserverDisconnect: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        bannerDataMock = undefined;
        resizeObserverObserve = vi.fn();
        resizeObserverDisconnect = vi.fn();
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: resizeObserverObserve,
            disconnect: resizeObserverDisconnect,
        }));
        document.documentElement.style.removeProperty("--header-offset");
    });

    afterEach(() => {
        document.documentElement.style.removeProperty("--header-offset");
    });

    it("публикует --header-offset на :root после монтирования", async () => {
        render(<MainHeader />);

        await waitFor(() => {
            expect(document.documentElement.style.getPropertyValue("--header-offset")).not.toBe("");
        });
        expect(resizeObserverObserve).toHaveBeenCalled();
    });

    it("подписывается на ResizeObserver, чтобы отследить появление баннера", () => {
        bannerDataMock = { url: "https://example.com", description: "test" };
        render(<MainHeader />);

        expect(resizeObserverObserve).toHaveBeenCalled();
    });
});
