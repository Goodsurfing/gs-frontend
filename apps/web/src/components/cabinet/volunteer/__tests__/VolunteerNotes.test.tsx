import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/session/SessionProvider", () => ({ useSession: () => ({ status: "loading", token: undefined }) }));

import type { VolunteerApplication } from "@/lib/volunteerApplications";

import { ApplicationSummary, type ApplicationSummaryLabels } from "../ApplicationSummary";
import { VolunteerNotes, type VolunteerNotesLabels } from "../VolunteerNotes";

const card: ApplicationSummaryLabels = {
    status: { new: "На рассмотрении", accepted: "Принята", canceled: "Отклонена" },
    next: { new: "Ждём ответа организатора", accepted: "Договоритесь о датах", canceled: "Посмотрите похожие" },
    noTitle: "Без названия",
};

const application = (patch: Partial<VolunteerApplication> = {}): VolunteerApplication => ({
    id: 1,
    chatId: 77,
    startDate: "01.12.2026",
    endDate: "15.12.2026",
    isHasReview: false,
    status: "accepted",
    volunteer: {} as never,
    vacancy: { id: 101, title: "Хаски-ферма", address: "Карелия", status: "active", categories: [], image: undefined, organization: { id: "o1", name: "Хутор Озёрный" } } as never,
    ...patch,
});

describe("карточка заявки волонтёра (GS-332)", () => {
    it("название, организатор, даты, статус и что дальше", () => {
        const html = renderToString(<ApplicationSummary item={application()} labels={card} organizer titleTag="h3" />);
        expect(html).toContain("<h3");
        expect(html).toContain("Хаски-ферма");
        expect(html).toContain("Хутор Озёрный");
        expect(html).toContain("01.12.2026 — 15.12.2026");
        expect(html).toContain("Принята");
        expect(html).toContain("Договоритесь о датах");
    });

    it("старый бэкенд без организатора — строки нет, остальное на месте", () => {
        const old = application({ status: "new", vacancy: { id: 5, title: "", address: null, status: "active", categories: [], image: undefined } as never });
        const html = renderToString(<ApplicationSummary item={old} labels={card} organizer />);
        expect(html).not.toContain("Хутор");
        expect(html).toContain("Без названия");
        expect(html).toContain("На рассмотрении");
        expect(html).toContain("Ждём ответа организатора");
    });

    it("неизвестный статус — как «На рассмотрении», не «Отклонена»", () => {
        const html = renderToString(<ApplicationSummary item={application({ status: "archived" })} labels={card} />);
        expect(html).toContain("На рассмотрении");
        expect(html).not.toContain("Отклонена");
    });
});

const labels: VolunteerNotesLabels = {
    search: "Поиск по вакансии и организатору",
    searchPlaceholder: "Вакансия или организатор",
    clearSearch: "Очистить поиск",
    tabsLabel: "Статус заявки",
    tabs: { all: "Все", new: "На рассмотрении", accepted: "Приняты", canceled: "Отклонены" },
    card,
    openOffer: "Открыть вакансию",
    review: "Написать отзыв",
    share: "Поделиться",
    loadError: "Не удалось загрузить заявки",
    retry: "Повторить",
    empty: "Пока нет заявок",
    emptyHint: "Выберите поездку",
    find: "Найти поездку",
    emptySearch: "По этому запросу заявок нет",
    emptyTab: "В этой вкладке пока нет заявок",
    resetSearch: "Сбросить поиск",
    sendError: "Ошибка",
    pagination: { prev: "Назад", next: "Вперёд", page: "Страница" },
    dialog: {} as never,
    shareDialog: {} as never,
};

describe("«Мои заявки» волонтёра: первый экран (GS-332)", () => {
    const html = renderToString(<VolunteerNotes locale="ru" hrefs={{ offer: "/offers/{id}", chat: "/messenger/{id}", catalog: "/offers-map" }} labels={labels} />);

    it("сверху поиск с подписью", () => {
        expect(html).toContain("Поиск по вакансии и организатору");
        expect(html).toContain('placeholder="Вакансия или организатор"');
    });

    it("вкладки по порядку: Все, На рассмотрении, Приняты, Отклонены", () => {
        const order = ["Все", "На рассмотрении", "Приняты", "Отклонены"].map((tab) => html.indexOf(`>${tab}`));
        expect(order.every((index) => index > 0)).toBe(true);
        expect([...order].sort((a, b) => a - b)).toEqual(order);
        expect(html).toContain('role="tablist"');
    });

    it("пока грузится — мерцающие заглушки карточек, не пустота", () => {
        expect(html).toContain('data-testid="applications-loading"');
        expect(html).toContain("animate-pulse");
    });
});
