import { describe, expect, it } from "vitest";

import { applicationDates, applicationHref, applicationStatus, fillTemplate, sortApplications, type VolunteerApplication } from "../volunteerApplications";

const app = (id: number, status: string, chatId = 0) => ({ id, status, chatId, startDate: "", endDate: "", vacancy: { id: 100 + id } }) as unknown as VolunteerApplication;

describe("отклики волонтёра на телефоне", () => {
    it("неизвестный статус — «На рассмотрении», а не отказ", () => {
        expect(applicationStatus("accepted")).toBe("accepted");
        expect(applicationStatus("canceled")).toBe("canceled");
        expect(applicationStatus("new")).toBe("new");
        expect(applicationStatus("что-то новое")).toBe("new");
    });

    it("живые заявки выше отклонённых, внутри — свежие выше", () => {
        const sorted = sortApplications([app(1, "canceled"), app(2, "new"), app(3, "accepted"), app(4, "canceled")]);
        expect(sorted.map((item) => item.id)).toEqual([3, 2, 4, 1]);
    });

    it("карточка ведёт в переписку, без неё — на вакансию", () => {
        const hrefs = { chat: "/messenger/{id}", offer: "/offers/{id}" };
        expect(applicationHref(app(1, "new", 55), hrefs)).toBe("/messenger/55");
        expect(applicationHref(app(1, "new", 0), hrefs)).toBe("/offers/101");
    });

    it("даты — строками с API, без разбора", () => {
        expect(applicationDates({ startDate: "01.12.2026", endDate: "15.12.2026" })).toBe("01.12.2026 — 15.12.2026");
        expect(applicationDates({ startDate: "01.12.2026", endDate: "" })).toBe("01.12.2026");
        expect(applicationDates({ startDate: "", endDate: "" })).toBe("");
    });

    it("подставляет значения в подпись", () => {
        expect(fillTemplate("Бесплатных откликов: {{left}} из {{ total }}", { left: 2, total: 3 })).toBe("Бесплатных откликов: 2 из 3");
    });
});
