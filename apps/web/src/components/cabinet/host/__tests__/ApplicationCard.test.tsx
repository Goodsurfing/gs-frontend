import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { type Application, ApplicationCard, applicationCardActions, type ApplicationCardLabels } from "../ApplicationCard";
import { NewApplicationsBanner } from "../NewApplicationsBanner";

const labels: ApplicationCardLabels = {
    statuses: { new: "Новая", accepted: "Принята", canceled: "Отклонена" },
    accept: "Принять",
    reject: "Отклонить",
    rejectConfirm: "Отклонить заявку? Волонтёр получит уведомление",
    cancel: "Отмена",
    reply: "Ответить",
    message: "Написать",
    openChat: "Открыть переписку",
    writeReview: "Написать отзыв",
    received: "Заявка получена",
    anonymous: "Аноним",
    member: "Член сообщества",
    international: "Международный клуб",
};

const routes = { volunteer: "/volunteers/{id}", offer: "/offers/{id}", chat: "/messenger/{id}" };

const application = (patch: Partial<Application> = {}): Application => ({
    id: 1,
    status: "new",
    chatId: 77,
    isHasReview: true,
    startDate: "10.12.2026",
    endDate: "24.12.2026",
    createdAt: "25.11.2026",
    messagePreview: "Здравствуйте! Работала два сезона на ферме под Петрозаводском",
    vacancy: { id: 5, title: "Хаски-ферма в Карелии", categories: [] },
    volunteer: { id: "u1", firstName: "Анна", lastName: "К.", isMember: false, isInternationalMember: false, achievements: [] },
    ...patch,
} as unknown as Application);

const card = (patch: Partial<Application> = {}) => renderToString(
    <ApplicationCard application={application(patch)} routes={routes} onStatus={() => undefined} onReview={() => undefined} labels={labels} />,
);

describe("карточка заявки у организатора (GS-331)", () => {
    it("имя, название вакансии, даты, начало текста отклика и статус", () => {
        const html = card();
        expect(html).toContain("Анна К.");
        expect(html).toContain("Хаски-ферма в Карелии");
        expect(html).toContain('href="/offers/5"');
        expect(html).toContain("10.12.2026 – 24.12.2026");
        expect(html).toContain("Здравствуйте! Работала два сезона");
        expect(html).toContain("line-clamp-2");
        expect(html).toContain("Новая");
    });

    it("без текста отклика — строки превью нет", () => {
        expect(card({ messagePreview: null })).not.toContain("application-preview");
    });

    it("новая: главная «Ответить» ведёт в переписку, «Отклонить» второй и контуром", () => {
        const html = card();
        const reply = html.match(/<a[^>]*>Ответить<\/a>/)?.[0] ?? "";
        expect(reply).toContain('href="/messenger/77"');
        expect(reply).toContain("bg-primary");
        const reject = html.match(/<button[^>]*>Отклонить<\/button>/)?.[0] ?? "";
        expect(reject).not.toContain("bg-error");
        expect(reject).toContain("border-accent-bg");
        expect(html.indexOf(">Ответить<")).toBeLessThan(html.indexOf(">Отклонить<"));
        // Решение «вслепую» в карточке не принимается — «Принять» только в переписке
        expect(html).not.toContain(">Принять<");
    });

    it("кнопки по статусу", () => {
        // isHasReview в схеме API описан как «bool» и генерируется не булевым — данные приходят булевы
        const actions = (value: { status: string; chatId: number | null; isHasReview: boolean }) => applicationCardActions(value as never);
        expect(actions({ status: "new", chatId: 1, isHasReview: true })).toEqual(["reply", "reject"]);
        expect(actions({ status: "new", chatId: null, isHasReview: true })).toEqual(["accept", "reject"]);
        expect(actions({ status: "accepted", chatId: 1, isHasReview: false })).toEqual(["message", "review"]);
        expect(actions({ status: "accepted", chatId: 1, isHasReview: true })).toEqual(["message"]);
        expect(actions({ status: "canceled", chatId: 1, isHasReview: true })).toEqual(["openChat"]);
    });

    it("подписи кнопок решения не отдаются переводчику браузера", () => {
        const html = card();
        for (const text of ["Ответить", "Отклонить"]) {
            const tag = html.match(new RegExp(`<(a|button)[^>]*>${text}</(a|button)>`))?.[0] ?? "";
            expect(tag).toContain('translate="no"');
        }
    });
});

describe("полоса «N новых заявок ждут ответа»", () => {
    const forms = { one: "{count} новая заявка ждёт ответа", few: "{count} новые заявки ждут ответа", many: "{count} новых заявок ждут ответа", other: "{count}" };

    it("нет новых — полосы нет", () => {
        expect(renderToString(<NewApplicationsBanner locale="ru" count={0} forms={forms} action="Ответить" href="/host/notes?status=new" />)).toBe("");
    });

    it("есть новые — число и ссылка «Ответить» на вкладку «Новые»", () => {
        const html = renderToString(<NewApplicationsBanner locale="ru" count={3} forms={forms} action="Ответить" href="/host/notes?status=new" />);
        expect(html).toContain("3 новые заявки ждут ответа");
        expect(html).toContain('href="/host/notes?status=new"');
    });
});
