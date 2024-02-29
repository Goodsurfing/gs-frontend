export type TagsOption = "Свежее" | "Популярное";

interface Tag {
    value: TagsOption;
    text: string;
}

export const tags: Tag[] = [
    {
        value: "Свежее",
        text: "Свежее",
    },
    {
        value: "Популярное",
        text: "Популярное",
    },
];
