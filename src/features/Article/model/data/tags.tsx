import { useTranslation } from "react-i18next";

export type TagsOption = "Свежее" | "Популярное";

interface Tag {
    value: TagsOption;
    text: string;
}

export const useFilterTags = () => {
    const { t } = useTranslation();

    const tags: Tag[] = [
        {
            value: "Свежее",
            text: t("Свежее"),
        },
        {
            value: "Популярное",
            text: t("Популярное"),
        },
    ];

    return tags;
};
