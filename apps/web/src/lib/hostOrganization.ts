import type { components } from "@goodsurfing/api";

/**
 * Организация API ↔ поля формы «Описание организации»
 * (hostDescriptionAdapter старого фронта).
 */
type Organization = components["schemas"]["Organization-organization.read_user.member_media_object.read"];

/** Типы из списка; всё остальное — «Другое» со своим текстом */
export const ORGANIZATION_TYPES = ["ИП", "ОАО", "ООО", "ООПТ", "НКО"] as const;
export const OTHER_TYPE = "Другое";

export interface OrganizationForm {
    name: string;
    address: string;
    shortDescription: string;
    type: string;
    otherType: string;
    website: string;
    description: string;
    vk: string;
    telegram: string;
    /** IRI картинки (/api/v1/media_objects/{id}) — его ждёт API организаций */
    avatar: { iri: string; contentUrl?: string | null; thumbnails?: unknown } | null;
}

export const EMPTY_ORGANIZATION_FORM: OrganizationForm = { name: "", address: "", shortDescription: "", type: "ИП", otherType: "", website: "", description: "", vk: "", telegram: "", avatar: null };

const isListed = (type: string) => (ORGANIZATION_TYPES as readonly string[]).includes(type);

/** Организация из API → поля формы (hostDescriptionFormAdapter старого фронта) */
export function toForm(organization: Organization): OrganizationForm {
    const type = organization.type ?? "";
    return {
        name: organization.name ?? "",
        address: organization.address ?? "",
        shortDescription: organization.shortDescription ?? "",
        type: isListed(type) ? type : OTHER_TYPE,
        otherType: isListed(type) ? "" : type,
        website: organization.website ?? "",
        description: organization.description ?? "",
        vk: organization.vk ?? "",
        telegram: organization.telegram ?? "",
        // В ответе id без префикса, а записывать нужно IRI
        avatar: organization.avatar?.id
            ? { iri: `/api/v1/media_objects/${organization.avatar.id}`, contentUrl: organization.avatar.contentUrl, thumbnails: (organization.avatar as { thumbnails?: unknown }).thumbnails }
            : null,
    };
}

/** Поля формы → тело запроса; «Другое» записывается текстом из второго поля */
export function toBody(form: OrganizationForm) {
    return {
        name: form.name,
        address: form.address,
        type: form.type === OTHER_TYPE ? form.otherType.trim() : form.type,
        description: form.description,
        shortDescription: form.shortDescription,
        website: form.website,
        vk: form.vk,
        telegram: form.telegram,
        avatar: form.avatar?.iri ?? null,
    };
}

