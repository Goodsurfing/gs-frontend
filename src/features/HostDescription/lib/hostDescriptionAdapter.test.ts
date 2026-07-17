import { describe, it, expect } from "vitest";
import { Host } from "@/entities/Host";
import {
    hostDescriptionApiAdapterUpdate,
    hostDescriptionFormAdapter,
} from "./hostDescriptionAdapter";

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

/**
 * Регресс-guard (row 88): поле avatar.id вручную собиралось как полный
 * внешний URL (`${BASE_URL}/api/v1/media_objects/${id}`) вместо
 * относительного IRI (`/api/v1/media_objects/{id}`), который на самом
 * деле ожидает бэкенд для organizations (подтверждено вживую на
 * стейдже: PATCH возвращал 400 "Invalid IRI" и на голом id, и на полном
 * внешнем URL). Из-за несовпадения формата avatar_id не проставлялся ни
 * у одной организации на проде — иконка организации никогда не
 * сохранялась и не отображалась.
 */
describe("hostDescriptionFormAdapter avatar id", () => {
    it("реконструирует относительный IRI медиа-объекта, а не внешний URL с доменом", () => {
        const hostWithAvatar: Host = {
            ...baseHost,
            avatar: {
                id: "media-object-uuid-123",
                contentUrl: "/media/avatar.jpg",
                isImage: true,
                originalHeight: 100,
                originalWidth: 100,
            },
        };

        const result = hostDescriptionFormAdapter(hostWithAvatar);

        expect(result.avatar?.id).toBe("/api/v1/media_objects/media-object-uuid-123");
    });
});

describe("hostDescriptionApiAdapterUpdate avatar id", () => {
    it("отправляет IRI медиа-объекта в теле запроса как есть", () => {
        const result = hostDescriptionApiAdapterUpdate({
            avatar: { id: "/api/v1/media_objects/media-object-uuid-456", contentUrl: "/media/avatar.jpg" },
            mainInfo: {
                aboutInfo: "", organization: "", shortOrganization: "", website: "",
            },
            socialMedia: {
                facebook: "", instagram: "", telegram: "", vk: "",
            },
            type: { organizationType: "НКО", otherOrganizationType: "" },
            address: "",
        });

        expect(result.avatar).toBe("/api/v1/media_objects/media-object-uuid-456");
    });
});
