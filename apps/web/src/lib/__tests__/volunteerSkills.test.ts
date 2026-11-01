import { describe, expect, it } from "vitest";

import { matchesAccept } from "../mediaUpload";
import { normalizeOwnSkills, parseSkillsDraft, skillsDraftKey } from "../volunteerSkills";

const DRAFT = {
    languages: [{ id: 5, language: "English", languageLevel: "advanced" }, { id: null, language: "Español", languageLevel: "beginner" }],
    skills: [1, 2],
    additional: ["Готовка"],
    extraInfo: "",
};

describe("parseSkillsDraft", () => {
    it("принимает черновик с id языков (null у новых)", () => {
        expect(parseSkillsDraft(JSON.stringify(DRAFT))).toEqual(DRAFT);
    });

    it("отбрасывает черновик старого формата и с неверными полями", () => {
        expect(parseSkillsDraft(null)).toBeNull();
        expect(parseSkillsDraft("{")).toBeNull();
        expect(parseSkillsDraft(JSON.stringify({ skills: [1] }))).toBeNull();
        expect(parseSkillsDraft(JSON.stringify({ ...DRAFT, languages: [{ language: "English", languageLevel: "advanced" }] }))).toBeNull();
        expect(parseSkillsDraft(JSON.stringify({ ...DRAFT, skills: ["1"] }))).toBeNull();
        expect(parseSkillsDraft(JSON.stringify({ ...DRAFT, additional: [1] }))).toBeNull();
        expect(parseSkillsDraft(JSON.stringify({ ...DRAFT, extraInfo: null }))).toBeNull();
    });

    it("чистит свои навыки и не пропускает больше 10 элементов", () => {
        const draft = parseSkillsDraft(JSON.stringify({ ...DRAFT, skills: Array.from({ length: 12 }, (_, i) => i), additional: [" Готовка ", "готовка", ""] }));
        expect(draft?.skills).toHaveLength(10);
        expect(draft?.additional).toEqual(["Готовка"]);
    });

    it("ключ черновика — свой у каждого пользователя", () => {
        expect(skillsDraftKey("u1")).not.toBe(skillsDraftKey("u2"));
    });
});

describe("normalizeOwnSkills", () => {
    it("обрезает пробелы, убирает пустые и повторы", () => {
        expect(normalizeOwnSkills(["  Фото ", "фото", " ", "Готовка"])).toEqual(["Фото", "Готовка"]);
    });
});

describe("matchesAccept", () => {
    const documents = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    it("проверяет тип перетащенного файла по accept", () => {
        expect(matchesAccept({ name: "a.png", type: "image/png" }, "image/*")).toBe(true);
        expect(matchesAccept({ name: "a.pdf", type: "application/pdf" }, "image/*")).toBe(false);
        expect(matchesAccept({ name: "a.pdf", type: "application/pdf" }, documents)).toBe(true);
        expect(matchesAccept({ name: "a.zip", type: "application/zip" }, documents)).toBe(false);
        expect(matchesAccept({ name: "a.doc", type: "" }, ".doc,.docx")).toBe(true);
    });
});
