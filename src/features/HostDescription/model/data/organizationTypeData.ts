import { OrganizationType } from "../types/hostDescription";

export type OrganizationTypeDataProps = {
    id: OrganizationType;
    text: OrganizationType;
};

export const organizationTypeData: OrganizationTypeDataProps[] = [
    {
        id: "Другое",
        text: "Другое",
    },
    {
        id: "ИП",
        text: "ИП",
    },
    {
        id: "ОАО",
        text: "ОАО",
    },
    {
        id: "ООО",
        text: "ООО",
    },
    {
        id: "ООПТ",
        text: "ООПТ",
    },
];
