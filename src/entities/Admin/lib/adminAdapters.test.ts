import { describe, it, expect } from "vitest";
import { AdminOrganization, AdminOrganizations } from "../model/types/adminSchema";
import { adminOrganizationAdapter, adminOrganizationsAdapter } from "./adminAdapters";

const baseOrganization: AdminOrganization = {
    id: "1",
    name: "Организация",
    isActive: true,
    address: "",
    type: "НКО",
    otherType: "",
    image: null,
    website: "",
    description: "",
    shortDescription: "",
    vk: "",
    facebook: "",
    instagram: "",
    telegram: "",
    countVacancies: 0,
    countApplications: 0,
};

/**
 * Регресс-guard для row 66: тип организации «НКО» не был известен
 * adminAdapters — в админке любая организация с type="НКО" сваливалась
 * в "Другое". PR gs-frontend#330.
 */
describe("adminOrganizationAdapter", () => {
    it("распознаёт тип организации «НКО», а не сваливает его в «Другое»", () => {
        const result = adminOrganizationAdapter(baseOrganization);

        expect(result.type?.organizationType).toBe("НКО");
        expect(result.type?.otherOrganizationType).toBe("");
    });
});

const baseOrganizationListItem: AdminOrganizations = {
    id: "1",
    name: "Организация",
    lastName: "Иванов",
    firstName: "Иван",
    countVacancies: 0,
    countApplications: 0,
    isActive: true,
    isMembership: false,
    endMembership: null,
};

/**
 * Регресс-guard для rows 112/113/115: у организаций не было видно
 * членство владельца (организационный тариф) в списке админки — только у
 * пользователей, и то было захардкожено в false на бэке.
 */
describe("adminOrganizationsAdapter", () => {
    it("пробрасывает isMembership и endMembership из API-ответа в строку таблицы", () => {
        const [result] = adminOrganizationsAdapter([
            { ...baseOrganizationListItem, isMembership: true, endMembership: "01.01.2027" },
        ]);

        expect(result.isMembership).toBe(true);
        expect(result.endMembership).toBe("01.01.2027");
    });

    it("отражает isMembership=false, когда у владельца нет активного членства", () => {
        const [result] = adminOrganizationsAdapter([baseOrganizationListItem]);

        expect(result.isMembership).toBe(false);
        expect(result.endMembership).toBeNull();
    });
});
