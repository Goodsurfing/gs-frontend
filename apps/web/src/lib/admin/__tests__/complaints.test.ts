import { describe, expect, it } from "vitest";

import { type Complaint, complaintActions, complaintLinks } from "../complaints";

const base: Complaint = {
    id: 1, createdAt: "25.11.2026 12:00", source: "user", reason: "abuse", comment: null, excerpt: "Текст", matched: null,
    status: "new", resolution: null, resolvedAt: null, resolvedBy: null, targetType: "message", targetId: "15",
    reporter: { id: "r", name: "Анна", email: "a@test.local" },
    targetUser: { id: "u1", name: "Пётр", email: "p@test.local", isActive: true, organizationId: null },
    chatId: 3, vacancyId: null, volunteerId: null, reviewActive: null,
};

describe("жалобы в админке: ссылки на объект", () => {
    it("сообщение — карточка автора", () => {
        expect(complaintLinks(base)).toEqual([{ label: "Карточка: Пётр", href: "/admin/users/u1" }]);
    });

    it("пользователь, организация, отзывы — страницы на сайте", () => {
        expect(complaintLinks({ ...base, targetType: "user", targetId: "u1" })[0]).toEqual({ label: "Профиль на сайте", href: "/volunteers/u1" });
        expect(complaintLinks({ ...base, targetType: "organization", targetId: "o1" })[0]?.href).toBe("/organizations/o1");
        expect(complaintLinks({ ...base, targetType: "review_vacancy", vacancyId: 42 })[0]?.href).toBe("/offers/42#review");
        expect(complaintLinks({ ...base, targetType: "review_volunteer", volunteerId: "v1" })[0]?.href).toBe("/volunteers/v1");
        expect(complaintLinks({ ...base, targetUser: null })).toEqual([]);
    });
});

describe("жалобы в админке: кнопки разбора", () => {
    it("у новой жалобы на отзыв — все три", () => {
        expect(complaintActions({ ...base, targetType: "review_vacancy", reviewActive: true })).toEqual(["none", "hide_review", "disable_user"]);
    });

    it("скрытый отзыв, отключённый пользователь, разобранная жалоба", () => {
        expect(complaintActions({ ...base, targetType: "review_volunteer", reviewActive: false })).toEqual(["none", "disable_user"]);
        expect(complaintActions({ ...base, targetUser: { ...base.targetUser!, isActive: false } })).toEqual(["none"]);
        expect(complaintActions({ ...base, status: "resolved" })).toEqual([]);
    });
});
