import { describe, expect, it } from "vitest";

import { userUpdateBody } from "../sections/UserCard";

const user = {
    id: "u1", email: "a@b.c", firstName: "Анна", lastName: null, birthDate: null, gender: null, image: { id: "img1" },
    country: null, city: "Казань", locale: "ru", phone: null, aboutMe: null, vk: null, facebook: null, instagram: null, telegram: null,
    additionalSkills: ["вязание"], skills: [{ id: 3, name: "Гид" }], achievements: [{ id: 7, name: "Первый отклик" }],
    created: null, lastVisit: null, isVerified: true, isVolunteer: true, isOrganization: false, isActive: true, isDelete: false, isPayment: false, endPayment: null,
};

describe("тело PATCH пользователя в админке", () => {
    it("отправляет все поля: API перезаписывает пользователя целиком", () => {
        const body = userUpdateBody(user, { city: "Москва" });
        expect(body).toMatchObject({ firstName: "Анна", lastName: "", city: "Москва", imageId: "img1", skillIds: [3], achievementIds: [7], additionalSkills: ["вязание"] });
    });

    it("не подставляет пол, если он не указан", () => {
        expect(userUpdateBody(user).gender).toBeNull();
        expect(userUpdateBody(user, { gender: "female" }).gender).toBe("female");
    });

    it("навыки и достижения можно заменить", () => {
        const body = userUpdateBody(user, { skillIds: [1, 2], achievementIds: [] });
        expect(body.skillIds).toEqual([1, 2]);
        expect(body.achievementIds).toEqual([]);
    });

    it("старые пользователи с null в навыках не ломают сохранение", () => {
        const body = userUpdateBody({ ...user, additionalSkills: null, skills: null, achievements: null });
        expect(body).toMatchObject({ additionalSkills: [], skillIds: [], achievementIds: [] });
    });
});
