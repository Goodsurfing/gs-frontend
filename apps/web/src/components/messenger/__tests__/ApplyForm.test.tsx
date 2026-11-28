import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { OfferTerms } from "@/lib/applyDates";
import type { CatalogOffer } from "@/lib/offersCatalog";

import { ApplyForm, type ApplyFormLabels } from "../ApplyForm";

const labels = {
    title: "Отклик на вакансию",
    when: "Когда вы хотите приехать",
    projectDates: "Сроки проекта",
    fullYear: "Круглый год",
    minStay: "Минимальный срок",
    maxStay: "Максимальный срок",
    days: { one: "{count} день", few: "{count} дня", many: "{count} дней", other: "{count} дня" },
    choosePeriod: "Выберите",
    windowHint: "Окно",
    freeHint: "Подставили даты",
    arrival: "Прибытие",
    departure: "Отъезд",
    notSet: "Не указано",
    about: "Пару слов о себе",
    optional: "необязательно",
    aboutPlaceholder: "",
    aboutHint: "",
    submit: "Отправить отклик",
    sending: "Отправляем…",
    needPeriod: "Выберите даты",
    loadError: "",
    retry: "",
    card: {},
} as unknown as ApplyFormLabels;

const offer = { id: 7274, title: "E2E Тестовая вакансия 4", description: "", address: "", rating: 0, reviews: 0, went: 0, active: true } as unknown as CatalogOffer;

const form = (offerInfo: OfferTerms) => renderToString(
    <ApplyForm
        locale="ru"
        offer={offer}
        offerHref="/offers/7274"
        offerInfo={offerInfo}
        dates={{ kind: "periods", periods: [{ start: "2026-12-03", end: "2027-01-26", window: true }], minDays: 7 }}
        terms={{ start: "2026-12-03", end: "2026-12-09" }}
        onTerms={() => undefined}
        message=""
        onMessage={() => undefined}
        onSubmit={() => undefined}
        busy={false}
        error={null}
        labels={labels}
    />,
);

/** Пары «подпись — значение» из блока условий */
const rows = (html: string) => [...html.matchAll(/<dt[^>]*>([^<]*)<\/dt><dd[^>]*>([^<]*)<\/dd>/g)].map((match) => [match[1], match[2]]);

describe("форма отклика: блок дат", () => {
    it("подпись «Когда вы хотите приехать» — над блоком (не legend на рамке) и называет группу", () => {
        const html = form({ project: null, minDays: null, maxDays: null });
        expect(html).not.toContain("<legend");
        expect(html).not.toContain("<fieldset");
        const id = /<p id="([^"]+)"[^>]*>Когда вы хотите приехать<\/p>/.exec(html)?.[1];
        expect(id).toBeTruthy();
        expect(html).toContain(`role="group" aria-labelledby="${id}"`);
    });

    it("сроки проекта и срок участия — с правильным числом", () => {
        const html = form({ project: { kind: "range", start: "2026-12-03", end: "2027-01-26" }, minDays: 7, maxDays: 21 });
        const [project, min, max] = rows(html);
        expect(project?.[0]).toBe("Сроки проекта");
        expect(project?.[1]).toMatch(/3 дек\. 2026.*26 янв\. 2027/);
        expect(min).toEqual(["Минимальный срок", "7 дней"]);
        expect(max).toEqual(["Максимальный срок", "21 день"]);
    });

    it("«круглый год»; чего нет — строки нет", () => {
        expect(rows(form({ project: { kind: "fullYear" }, minDays: 2, maxDays: null }))).toEqual([["Сроки проекта", "Круглый год"], ["Минимальный срок", "2 дня"]]);
        expect(form({ project: null, minDays: null, maxDays: null })).not.toContain("<dl");
    });
});

describe("форма отклика: черновик и членство (GS-341)", () => {
    const withSlots = () => renderToString(
        <ApplyForm
            locale="ru"
            offer={offer}
            offerHref="/offers/7274"
            offerInfo={{ project: null, minDays: null, maxDays: null }}
            dates={{ kind: "free", suggestion: { start: "2026-12-05", end: "2026-12-18" } }}
            terms={{ start: "2026-12-05", end: "2026-12-18" }}
            onTerms={() => undefined}
            message="Восстановленный текст"
            onMessage={() => undefined}
            onSubmit={() => undefined}
            busy={false}
            error={null}
            notice={<p>ЧЕРНОВИК-ВОССТАНОВЛЕН</p>}
            membership={<section>НУЖНО-ЧЛЕНСТВО</section>}
            labels={labels}
        />,
    );

    it("подсказка о черновике — над датами, блок членства — над кнопкой «Отправить отклик»", () => {
        const html = withSlots();
        const notice = html.indexOf("ЧЕРНОВИК-ВОССТАНОВЛЕН");
        const when = html.indexOf("Когда вы хотите приехать");
        const membership = html.indexOf("НУЖНО-ЧЛЕНСТВО");
        const submit = html.indexOf("Отправить отклик");
        expect(notice).toBeGreaterThan(-1);
        expect(notice).toBeLessThan(when);
        expect(membership).toBeGreaterThan(when);
        expect(membership).toBeLessThan(submit);
        expect(html).toContain("Восстановленный текст");
    });
});
