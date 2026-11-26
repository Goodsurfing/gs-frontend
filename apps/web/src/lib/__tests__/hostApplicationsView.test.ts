import { describe, expect, it } from "vitest";

import { applicationsFilterQuery, applicationsListQuery, parseApplicationsFilter, pluralText } from "../hostApplicationsView";

const waiting = { one: "{count} новая заявка ждёт ответа", few: "{count} новые заявки ждут ответа", many: "{count} новых заявок ждут ответа", other: "{count} новой заявки ждут ответа" };

describe("заявки организатора: фильтры в адресе (GS-331)", () => {
    it("по умолчанию — «Новые», первая страница, без поиска", () => {
        expect(parseApplicationsFilter(new URLSearchParams(""))).toEqual({ tab: "new", search: "", vacancyId: undefined, page: 1 });
    });

    it("читает вкладку, поиск, вакансию и страницу; мусор отбрасывает", () => {
        expect(parseApplicationsFilter(new URLSearchParams("status=all&q=Анна&vacancy=12&page=3"))).toEqual({ tab: "all", search: "Анна", vacancyId: 12, page: 3 });
        expect(parseApplicationsFilter(new URLSearchParams("status=deleted&vacancy=abc&page=-1"))).toEqual({ tab: "new", search: "", vacancyId: undefined, page: 1 });
    });

    it("в адрес — только то, что отличается от значений по умолчанию; туда и обратно без потерь", () => {
        expect(applicationsFilterQuery({ tab: "new", search: "  ", page: 1 })).toBe("");
        const filter = { tab: "canceled" as const, search: "Илья", vacancyId: 7, page: 2 };
        const query = applicationsFilterQuery(filter);
        expect(query).toBe("?status=canceled&q=%D0%98%D0%BB%D1%8C%D1%8F&vacancy=7&page=2");
        expect(parseApplicationsFilter(new URLSearchParams(query.slice(1)))).toEqual(filter);
    });

    it("запрос списка: «Все» — без статуса, пустой поиск не отправляется", () => {
        expect(applicationsListQuery({ tab: "all", search: " ", page: 1 })).toEqual({ limit: "10", page: "1" });
        expect(applicationsListQuery({ tab: "new", search: " анна ", vacancyId: 5, page: 2 })).toEqual({ limit: "10", page: "2", status: "new", vacancyId: 5, search: "анна" });
    });
});

describe("«N новых заявок ждут ответа» — по-русски с правильным окончанием", () => {
    it.each([
        [1, "1 новая заявка ждёт ответа"],
        [3, "3 новые заявки ждут ответа"],
        [5, "5 новых заявок ждут ответа"],
        [21, "21 новая заявка ждёт ответа"],
        [11, "11 новых заявок ждут ответа"],
    ])("%i", (count, text) => {
        expect(pluralText("ru", count, waiting)).toBe(text);
    });

    it("в английском — one/other", () => {
        expect(pluralText("en", 2, { one: "{count} new application", other: "{count} new applications" })).toBe("2 new applications");
    });
});
