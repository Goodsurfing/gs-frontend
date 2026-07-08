import { describe, it, expect } from "vitest";
import { AdminOrganization } from "../model/types/adminSchema";
import { adminOrganizationAdapter } from "./adminAdapters";

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
