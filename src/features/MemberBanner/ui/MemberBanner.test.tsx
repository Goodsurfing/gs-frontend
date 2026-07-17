import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemberBanner } from "./MemberBanner";

const navigateMock = vi.fn();

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Регресс-guard (ROW 73): блок на рабочем столе организатора
 * «Зарегистрируй членство организатора» должен вести на /membership#host,
 * чтобы страница прокручивалась к секции ForHost, а не просто к началу
 * /membership. MemberBanner раньше всегда навигировал на голый URL без якоря.
 */
describe("MemberBanner", () => {
    it("без anchor навигирует на голый /{locale}/membership", () => {
        render(<MemberBanner />);
        fireEvent.click(screen.getByRole("button"));
        expect(navigateMock).toHaveBeenCalledWith("/ru/membership");
    });

    it("с anchor=\"host\" навигирует на /{locale}/membership#host", () => {
        render(<MemberBanner anchor="host" />);
        fireEvent.click(screen.getByRole("button"));
        expect(navigateMock).toHaveBeenCalledWith("/ru/membership#host");
    });

    it("использует переданные title/buttonText вместо дефолтных волонтёрских", () => {
        render(
            <MemberBanner
                title="Зарегистрируй членство организатора"
                buttonText="Получить членство хоста"
                anchor="host"
            />,
        );
        expect(screen.getByText("Зарегистрируй членство организатора")).toBeInTheDocument();
        expect(screen.getByText("Получить членство хоста")).toBeInTheDocument();
    });
});
