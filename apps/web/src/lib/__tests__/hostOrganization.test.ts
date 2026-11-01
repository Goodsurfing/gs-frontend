import { describe, expect, it } from "vitest";

import { EMPTY_ORGANIZATION_FORM, toBody, toForm } from "../hostOrganization";

const organization = {
    id: "org-1",
    name: "Заповедник",
    address: "Алтай",
    type: "НКО",
    website: "https://example.org",
    description: "Описание",
    shortDescription: "Коротко",
    vk: "https://vk.com/x",
    facebook: "",
    instagram: "",
    telegram: "",
    isActive: true,
    averageRating: 0,
    reviewsCount: 0,
    avatar: { id: "media-1", contentUrl: "/media/a.jpg", isImage: true },
};

describe("форма организации", () => {
    it("тип из списка остаётся типом, аватар записывается IRI", () => {
        const form = toForm(organization);
        expect(form.type).toBe("НКО");
        expect(form.otherType).toBe("");
        expect(form.avatar?.iri).toBe("/api/v1/media_objects/media-1");
        expect(toBody(form)).toMatchObject({ type: "НКО", avatar: "/api/v1/media_objects/media-1", name: "Заповедник" });
    });

    it("тип не из списка (и пустой) — «Другое» со своим текстом", () => {
        expect(toForm({ ...organization, type: "Фермерское хозяйство" })).toMatchObject({ type: "Другое", otherType: "Фермерское хозяйство" });
        expect(toForm({ ...organization, type: "" })).toMatchObject({ type: "Другое", otherType: "" });
        expect(toBody({ ...EMPTY_ORGANIZATION_FORM, type: "Другое", otherType: "  Ферма " }).type).toBe("Ферма");
    });

    it("без аватара — null, чтобы удалить картинку", () => {
        expect(toBody(toForm({ ...organization, avatar: null })).avatar).toBeNull();
    });
});
