import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import {
    describe, expect, it, vi,
} from "vitest";

import { getAlternateUrls } from "./SeoHelmet";
import { PageSeo } from "./PageSeo";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => `t:${key}` }),
}));

describe("getAlternateUrls", () => {
    it("русская версия без префикса, en/es с префиксом, x-default — русская", () => {
        expect(getAlternateUrls("https://goodsurfing.org/en/offers/42")).toEqual([
            { hrefLang: "ru", href: "https://goodsurfing.org/offers/42" },
            { hrefLang: "en", href: "https://goodsurfing.org/en/offers/42" },
            { hrefLang: "es", href: "https://goodsurfing.org/es/offers/42" },
            { hrefLang: "x-default", href: "https://goodsurfing.org/offers/42" },
        ]);
    });

    it("с русской страницы — те же адреса", () => {
        expect(getAlternateUrls("https://goodsurfing.org/offers/42")[1])
            .toEqual({ hrefLang: "en", href: "https://goodsurfing.org/en/offers/42" });
    });

    it("главная: корень для русского, /en и /es без завершающего «/»", () => {
        const urls = getAlternateUrls("https://goodsurfing.org/es");
        expect(urls[0].href).toBe("https://goodsurfing.org/");
        expect(urls[1].href).toBe("https://goodsurfing.org/en");
    });

    it("пусто, если ссылка не абсолютная", () => {
        expect(getAlternateUrls("/offers/42")).toEqual([]);
    });
});

describe("PageSeo", () => {
    const renderSeo = (ui: React.ReactElement) => render(<HelmetProvider>{ui}</HelmetProvider>);
    const meta = (selector: string) => document.head.querySelector(selector)?.getAttribute("content");

    it("тексты по умолчанию из seo.json и hreflang", async () => {
        renderSeo(<PageSeo section="offersMap" path="/en/offers-map" />);

        await waitFor(() => expect(document.title).toBe("t:offersMap.title"));
        expect(meta("meta[name=\"description\"]")).toBe("t:offersMap.description");
        expect(document.head.querySelectorAll("link[rel=\"alternate\"]")).toHaveLength(4);
        expect(meta("meta[property=\"og:locale\"]")).toBe("en_US");
        expect(document.documentElement.lang).toBe("en");
    });

    it("данные страницы важнее текстов по умолчанию, HTML вычищается", async () => {
        renderSeo(
            <PageSeo
                section="host"
                path="/ru/organizations/abc"
                title="Заповедник"
                description="<p>Помогаем <b>природе</b></p>"
            />,
        );

        await waitFor(() => expect(document.title).toBe("Заповедник — GoodSurfing"));
        expect(meta("meta[name=\"description\"]")).toBe("Помогаем природе");
    });

    it("noindex для профилей людей", async () => {
        renderSeo(<PageSeo section="volunteer" path="/ru/volunteers/1" noindex />);

        await waitFor(() => expect(meta("meta[name=\"robots\"]")).toBe("noindex, follow"));
    });
});
