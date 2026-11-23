import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OfferDatesPassed } from "../OfferDatesPassed";

const labels = { title: "Даты прошли", text: "Ответа может не быть", similar: "Похожие", all: "Все вакансии", noAddress: "Без адреса" };
const props = { offerHref: (id: number) => `/offers/${id}`, catalogHref: "/offers-map", labels };

describe("плашка «Даты прошли» (GS-277)", () => {
    it("похожие — карточками с превью small и местом под картинку", () => {
        const html = renderToStaticMarkup(
            <OfferDatesPassed
                {...props}
                similar={[
                    { id: 7, title: "Заповедник", address: "Алтай", image: { id: "a", contentUrl: "https://s3/x.jpg", thumbnails: { small: "https://s3/x_small.jpg" } } as never },
                    { id: 8, title: "Ферма", address: null, image: null },
                ]}
            />,
        );
        expect(html).toContain('href="/offers/7"');
        expect(html).toContain("x_small.jpg");
        expect(html).toContain('width="64"');
        expect(html).toContain("Без адреса");
        expect(html).toContain("Похожие");
        expect(html).toContain('href="/offers-map"');
    });

    it("похожих нет — только текст и ссылка на каталог", () => {
        const html = renderToStaticMarkup(<OfferDatesPassed {...props} similar={[]} />);
        expect(html).toContain("Даты прошли");
        expect(html).not.toContain("Похожие");
        expect(html).toContain('href="/offers-map"');
    });
});
