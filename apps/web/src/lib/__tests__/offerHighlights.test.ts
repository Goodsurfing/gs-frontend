import { describe, expect, it } from "vitest";

import { offerHighlights } from "../offerHighlights";

const dict: Record<string, string> = {
    "conditions.Комната": "Комната", "conditions.Полный пансион": "Полный пансион",
    "whatToDo.day": "в день", "whatToDo.week": "в неделю", "highlights.hours": "{hours} ч {per}", "highlights.dayOff": "выходных в неделю: {n}", "highlights.minDays": "от {n} дн.",
};
const t = (key: string) => dict[key] ?? key;

describe("главное кратко", () => {
    it("жильё, питание, часы, выходные, срок", () => {
        expect(offerHighlights({
            condition: { houses: [{ name: "Комната" }], foods: [{ name: "Полный пансион" }] },
            whatToDo: { hour: 4, timeType: "day", dayOff: 2 },
            when: { durationMinDays: 14 },
        }, t)).toEqual(["Комната", "Полный пансион", "4 ч в день", "выходных в неделю: 2", "от 14 дн."]);
    });

    it("пустые и неизвестные поля — без плашек", () => {
        expect(offerHighlights({ condition: { houses: [{ name: "Неизвестное" }], foods: null }, whatToDo: { hour: 0, dayOff: 0 }, when: null }, t)).toEqual([]);
    });

    it("часы с переноса: 35 «в день» — это 35 в неделю", () => {
        expect(offerHighlights({ whatToDo: { hour: 35, timeType: "day" } }, t)).toEqual(["35 ч в неделю"]);
        expect(offerHighlights({ whatToDo: { hour: 6, timeType: "day" } }, t)).toEqual(["6 ч в день"]);
    });
});
