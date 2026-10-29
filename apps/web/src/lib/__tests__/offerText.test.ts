import { describe, expect, it } from "vitest";

import {
    ageText, gendersText, languagesText, money, organizationType, participateText, receptionPlaceText, skillName,
} from "../offerText";

const t = (key: string, values?: Record<string, string | number>) => `[${key}${values ? JSON.stringify(values) : ""}]`;

describe("offerText", () => {
    it("пол, возраст, откуда — ключи старого фронта", () => {
        expect(gendersText(["male", "female"], t)).toBe("[personalOffer.male], [personalOffer.female]");
        expect(gendersText([], t)).toBe("[personalOffer.notSpecified]");
        expect(ageText(18, 100, t)).toBe('[whoNeeds.от {{min}}{"min":18}]');
        expect(ageText(20, 40, t)).toBe('[whoNeeds.от {{min}} до {{max}}{"min":20,"max":40}]');
        expect(receptionPlaceText("any", t)).toBeNull();
        expect(receptionPlaceText("foreigners", t)).toBe("[whoNeeds.Только иностранцев]");
    });

    it("языки: «не важен» одной подписью, иначе пары язык/уровень", () => {
        expect(languagesText([], t)).toBeNull();
        expect(languagesText([{ language: "not_matter", languageLevel: "beginner" }], t)).toBe("[whoNeeds.Не важен]");
        expect(languagesText([{ language: "English", languageLevel: "advanced" }, { language: "Klingon", languageLevel: "x" }], t)).toEqual([
            { language: "[whoNeeds.Английский]", level: "[whoNeeds.Продвинутый]" },
            { language: "Klingon", level: "x" },
        ]);
    });

    it("деньги, навыки, тип организации", () => {
        expect(money(2200, "RUB")).toBe("2200 ₽");
        expect(skillName("Садоводство", t)).toBe("[skills.gardening]");
        expect(skillName("Неизвестный", t)).toBe("");
        expect(organizationType("НКО", t)).toBe("[hostDescription.НКО]");
        expect(organizationType("Фонд", t)).toBe("Фонд");
    });

    it("кнопка «Участвовать»: закрыта, нужна роль, состояние заявки", () => {
        const labels = { participate: "Участвовать", closed: "Закрыта", becomeVolunteer: "Станьте", states: { "Вы участвуете": "Участвуете" } };
        expect(participateText({ closed: true, needVolunteerRole: true, textParticipate: null }, labels)).toBe("Закрыта");
        expect(participateText({ closed: false, needVolunteerRole: true, textParticipate: null }, labels)).toBe("Станьте");
        expect(participateText({ closed: false, needVolunteerRole: false, textParticipate: "Вы участвуете" }, labels)).toBe("Участвуете");
        expect(participateText({ closed: false, needVolunteerRole: false, textParticipate: "Что-то новое" }, labels)).toBe("Участвовать");
    });
});
