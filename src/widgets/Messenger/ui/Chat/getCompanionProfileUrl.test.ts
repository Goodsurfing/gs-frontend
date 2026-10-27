import { describe, it, expect } from "vitest";
import { ProfileById } from "@/entities/Profile";
import { getCompanionProfileUrl } from "./getCompanionProfileUrl";

const volunteerOnly = {
    id: "u-1",
    hostId: null,
    volunteer: { id: "v-1" },
} as unknown as ProfileById;

const hostOnly = {
    id: "u-2",
    hostId: "org-1",
    volunteer: null,
} as unknown as ProfileById;

const hostAndVolunteer = {
    id: "u-3",
    hostId: "org-2",
    volunteer: { id: "v-3" },
} as unknown as ProfileById;

describe("getCompanionProfileUrl", () => {
    it("собеседник только волонтёр — профиль волонтёра для любого зрителя", () => {
        expect(getCompanionProfileUrl(volunteerOnly, "ru", false)).toBe("/ru/volunteers/u-1");
        expect(getCompanionProfileUrl(volunteerOnly, "ru", true)).toBe("/ru/volunteers/u-1");
    });

    it("собеседник только организатор — организация для любого зрителя", () => {
        expect(getCompanionProfileUrl(hostOnly, "ru", false)).toBe("/ru/organizations/org-1");
        expect(getCompanionProfileUrl(hostOnly, "ru", true)).toBe("/ru/organizations/org-1");
    });

    it("собеседник с обоими профилями — волонтёру показываем организацию", () => {
        expect(getCompanionProfileUrl(hostAndVolunteer, "ru", false)).toBe("/ru/organizations/org-2");
    });

    it("собеседник с обоими профилями — организатору показываем профиль волонтёра", () => {
        expect(getCompanionProfileUrl(hostAndVolunteer, "en", true)).toBe("/en/volunteers/u-3");
    });

    it("без собеседника ссылки нет", () => {
        expect(getCompanionProfileUrl(undefined, "ru", false)).toBeUndefined();
    });
});
