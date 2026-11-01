import type { VolunteerArticleEditorLabels } from "@/components/cabinet/volunteer/articles/VolunteerArticleEditor";
import type { Translate } from "@/i18n/dictionary";

/**
 * Подписи формы статьи — общие для «Написать в блог» и правки статьи. Тексты
 * ошибок и сообщений в старом фронте не переводились — оставлены как есть;
 * подписи кнопок панели редактора — как aria-label старого ToolBar.
 */
export function volunteerArticleLabels(tv: Translate): VolunteerArticleEditorLabels {
    const c = (key: string) => tv(`volunteer-create-article.${key}`);
    return {
        form: {
            addCover: c("Добавить фото обложки"),
            coverHint: c("Оптимальные размеры 2175 х 966. Вес не более 5МБ"),
            change: c("Изменить"),
            remove: c("Удалить"),
            title: c("Название статьи"),
            titlePlaceholder: c("Заголовок вашей статьи"),
            category: c("Категория статьи"),
            publish: c("Опубликовать"),
            draft: c("Сохранить в черновики"),
            errors: {
                cover: "Загрузите обложку",
                required: "Поле обязательно для заполнения",
                short: c("Заголовок слишком короткий"),
                long: c("Заголовок слишком большой"),
                categories: "Выберите хотя бы одну категорию",
            },
            editor: {
                bold: "bold",
                italic: "italic",
                underline: "underlined",
                alignLeft: "left",
                alignCenter: "center",
                alignJustify: "justify",
                ordered: "ordered",
                bullet: "bullet",
                link: "link",
                image: "image",
                emoji: "smile",
                undo: "back",
                redo: "forward",
                clear: "clear",
                text: "text",
            },
        },
        createError: "Произошла ошибка при создании статьи",
        updateError: "Произошла ошибка при обновлении статьи",
        published: "Статья успешно обновлена и опубликована",
        drafted: "Статья успешно сохранена в черновиках",
        uploadError: "Произошла ошибка при загрузке изображения",
    };
}
