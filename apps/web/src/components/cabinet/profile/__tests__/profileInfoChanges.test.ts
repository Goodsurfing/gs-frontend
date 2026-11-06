import { describe, expect, it } from "vitest";

import { hasChanges } from "../ProfileInfoForm";

const base = {
    firstName: "Тест", lastName: "Волонтёр", day: "", month: "", year: "", gender: "", country: "", city: "",
    locale: "ru", phone: "", aboutMe: "", vk: "", facebook: "", instagram: "", telegram: "", image: null,
};

describe("«Обо мне»: несохранённые правки", () => {
    it("правка поля — есть изменения, та же форма — нет", () => {
        expect(hasChanges(base, { ...base })).toBe(false);
        expect(hasChanges(base, { ...base, city: "Казань" })).toBe(true);
    });
    it("фото сохраняется сразу и правкой формы не считается", () => {
        expect(hasChanges(base, { ...base, image: { id: "1", contentUrl: "/a.jpg" } })).toBe(false);
    });
});

describe("«Обо мне»: новичку без роли не предлагаем членство", () => {
    it("ни роли волонтёра, ни организации — новичок", async () => {
        const { isNewcomer } = await import("../ProfileInfoForm");
        expect(isNewcomer({ volunteer: null, hostId: null })).toBe(true);
        expect(isNewcomer({ volunteer: { id: "1" }, hostId: null })).toBe(false);
        expect(isNewcomer({ volunteer: null, hostId: "h1" })).toBe(false);
    });
});
