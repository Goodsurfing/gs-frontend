import { describe, it, expect } from "vitest";
import { Host } from "@/entities/Host";
import { hostDescriptionFormAdapter } from "./hostDescriptionAdapter";

const baseHost: Host = {
    id: "1",
    name: "Организация",
    active: true,
    address: "",
    type: "НКО",
    otherType: "",
    website: "",
    description: "",
    shortDescription: "",
    vk: "",
    facebook: "",
    instagram: "",
    telegram: "",
    team: [],
    vacancies: [],
    owner: {} as Host["owner"],
    videoGallery: [],
    galleryImages: [],
    feedbacksCount: 0,
};

/**
 * Регресс-guard для row 66: тип организации «НКО» не был известен
 * hostDescriptionAdapter — при чтении с бэка любая организация с
 * type="НКО" сваливалась в "Другое". PR gs-frontend#330.
 */
describe("hostDescriptionFormAdapter", () => {
    it("распознаёт тип организации «НКО», а не сваливает его в «Другое»", () => {
        const result = hostDescriptionFormAdapter(baseHost);

        expect(result.type?.organizationType).toBe("НКО");
        expect(result.type?.otherOrganizationType).toBe("");
    });
});
