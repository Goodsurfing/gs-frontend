import { useTranslation } from "react-i18next";

export type TagsOption = "new" | "popular";

interface Tag {
    value: TagsOption;
    text: string;
}

export const useFilterTags = () => {
    const { t } = useTranslation();

    const tags: Tag[] = [
        {
            value: "new",
            text: t("Свежее"),
        },
        {
            value: "popular",
            text: t("Популярное"),
        },
    ];

    return tags;
};
