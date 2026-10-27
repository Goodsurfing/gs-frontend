import { describe, it, expect } from "vitest";
import { ProfileById } from "@/entities/Profile";
import { getCompanionProfileUrl } from "./getCompanionProfileUrl";

const volunteer = {
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
    it("ведёт на профиль волонтёра", () => {
        expect(getCompanionProfileUrl(volunteer, "ru")).toBe("/ru/volunteers/u-1");
    });

    it("ведёт организатора без профиля волонтёра на страницу организации", () => {
        expect(getCompanionProfileUrl(hostOnly, "ru")).toBe("/ru/organizations/org-1");
    });

    it("при обоих профилях ведёт на страницу волонтёра", () => {
        expect(getCompanionProfileUrl(hostAndVolunteer, "en")).toBe("/en/volunteers/u-3");
    });

    it("без собеседника ссылки нет", () => {
        expect(getCompanionProfileUrl(undefined, "ru")).toBeUndefined();
    });
});
