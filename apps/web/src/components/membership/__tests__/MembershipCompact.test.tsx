import { readFileSync } from "node:fs";
import { join } from "node:path";

import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ value: { status: "guest", token: null, profile: null, memberships: [] } as Record<string, unknown> }));
vi.mock("@/components/session/SessionProvider", () => ({
    useSession: () => session.value,
    activeMembership: (list: { category?: string }[] | undefined, category: string) => list?.find((item) => item.category === category) ?? null,
}));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("payment_id=p1") }));

import { PaymentFailFeedback } from "@/components/checkout-feedback/PaymentFailFeedback";

import { MembershipCompactHero, type CompactHeroLabels } from "../MembershipCompactHero";
import { MobileDetails } from "../MobileDetails";

const labels: CompactHeroLabels = {
    title: "Членство Гудсёрфинга",
    volunteerPrice: "990 ₽",
    hostPrice: "4 990 ₽",
    perYear: "в год",
    duo: "На двоих — 1 490 ₽ в год",
    benefits: ["Отклики без ограничений", "Значок в профиле", "Поддержка сообщества"],
    hostBenefits: ["Больше одной вакансии", "Значок организатора", "Поддержка сообщества"],
    button: "Оформить",
    note: "Членство включается сразу после оплаты.",
    member: "Членство у вас уже есть",
    memberUntil: "Членство активно до {{date}}",
    memberLink: "Получить членство",
    more: "Подробнее",
};
const option = (code: string) => ({ href: `/payment?tariff=${code}`, button: "", stickyTitle: "" });
const hero = (override: Partial<CompactHeroLabels> = {}) => renderToString(
    <MembershipCompactHero id="membership-compact" locale="ru" volunteer={option("volunteer_990")} host={option("host_4990")} duoHref="/payment?tariff=volunteer_duo" labels={{ ...labels, ...override }} />,
);

describe("страница членства на телефоне (GS-333)", () => {
    beforeEach(() => {
        session.value = { status: "guest", token: null, profile: null, memberships: [] };
    });

    it("первый экран: цена за год, «на двоих», три выгоды и зелёная «Оформить» к оплате", () => {
        const html = hero();
        expect(html).toContain("990 ₽");
        expect(html).toContain("в год");
        expect(html).toContain("/payment?tariff=volunteer_duo");
        expect(html.match(/<li[ >]/g)).toHaveLength(3);
        expect(html).toMatch(/href="\/payment\?tariff=volunteer_990"[^>]*bg-cta[^>]*>Оформить</);
        // только на телефоне: на компьютере прежняя шапка
        expect(html).toMatch(/class="hidden [^"]*down-md:block"/);
    });

    it("«на двоих» выключен в админке — строки нет", () => {
        expect(hero({ duo: null })).not.toContain("volunteer_duo");
    });

    it("организатору — его тариф и выгоды, без «на двоих»", () => {
        session.value = { status: "user", token: "t", profile: { hostId: "h1" }, memberships: [] };
        const html = hero();
        expect(html).toContain("4 990 ₽");
        expect(html).toContain("/payment?tariff=host_4990");
        expect(html).toContain("Больше одной вакансии");
        expect(html).not.toContain("volunteer_duo");
    });

    it("с действующим членством — без кнопки оплаты", () => {
        session.value = { status: "user", token: "t", profile: null, memberships: [{ category: "REGULAR" }] };
        const html = hero();
        expect(html).toContain("Членство у вас уже есть");
        expect(html).not.toContain("/payment?tariff=volunteer_990");
    });

    it("с действующим членством — крупно «активно до», без цены и «на двоих» (сдача клуба 27.11)", () => {
        session.value = { status: "user", token: "t", profile: null, memberships: [{ category: "REGULAR", endDate: "2027-11-27T12:00:00+03:00" }] };
        const html = hero();
        expect(html).toMatch(/role="status"[^>]*>.*Членство активно до 27\.11\.2027/);
        expect(html).not.toContain("990 ₽");
        expect(html).not.toContain("volunteer_duo");
    });

    it("«Подробнее»: на телефоне свёрнуто кнопкой, содержимое в разметке и раскрыто на компьютере", () => {
        const html = renderToString(<MobileDetails title="Международный клуб"><p>Текст клуба</p></MobileDetails>);
        expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*class="hidden [^"]*down-md:flex/);
        expect(html).toContain("Текст клуба");
        expect(html).toMatch(/class="down-md:hidden"><p>Текст клуба/);
    });

    it("страница членства: все длинные блоки — под «Подробнее», цены из API (не вписаны в текст)", () => {
        const page = readFileSync(join(__dirname, "../../../app/[locale]/membership/page.tsx"), "utf8");
        expect(page.match(/<MobileDetails /g)?.length).toBeGreaterThanOrEqual(8);
        expect(page).toContain("<MembershipCompactHero");
        for (const lang of ["ru", "en", "es"]) {
            const dict = JSON.parse(readFileSync(join(__dirname, `../../../../../../public/locales/${lang}/membership.json`), "utf8")) as { compact: Record<string, string> };
            expect(dict.compact.price, lang).toBe("{{price}} ₽");
            expect(Object.values(dict.compact).join(" "), lang).not.toMatch(/\d{3}/);
        }
    });
});

describe("ошибка оплаты: «Что помешало?» одной строкой (GS-333)", () => {
    const feedbackLabels = {
        title: "Что помешало оплатить?",
        hint: "",
        reasons: { expensive: "Дорого", later: "Позже", payment_method: "Способ", unclear: "Непонятно", technical: "Ошибка", other: "Другое" },
        comment: "",
        submit: "Отправить",
        thanks: "",
        error: "",
    };

    it("вошедшему — свёрнутая строка-кнопка, без вариантов ответа", () => {
        session.value = { status: "user", token: "t", profile: null, memberships: [] };
        const html = renderToString(<PaymentFailFeedback labels={feedbackLabels} />);
        expect(html).toMatch(/<button[^>]*aria-expanded="false"[^>]*>Что помешало оплатить\?<\/button>/);
        expect(html).not.toContain("Дорого");
    });

    it("гостю — ничего", () => {
        session.value = { status: "guest", token: null, profile: null, memberships: [] };
        expect(renderToString(<PaymentFailFeedback labels={feedbackLabels} />)).toBe("");
    });
});
