import "server-only";

import type { ApplicationCardLabels } from "@/components/cabinet/host/ApplicationCard";
import type { HostReviewDialogLabels } from "@/components/cabinet/host/HostReviewDialog";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

/** Подписи карточки заявки и окна отзыва — общие для рабочего стола и «Заявок» */
export async function applicationLabels(locale: Locale): Promise<{ card: ApplicationCardLabels; dialog: HostReviewDialogLabels; statusError: string }> {
    const [t, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "host")]);
    const statuses = { new: t("notes.new"), accepted: t("notes.accepted"), canceled: t("notes.canceled") };
    return {
        card: {
            statuses,
            accept: t("notes.Принять"),
            reject: t("notes.Отклонить"),
            message: t("notes.Сообщение"),
            writeReview: t("notes.Написать отзыв"),
            noAddress: t("notes.Адрес не указан"),
            received: t("notes.Заявка получена"),
            anonymous: t("Анонимный пользователь"),
            member: t("membershipBadge.Член сообщества"),
            international: t("membershipBadge.Международный клуб"),
        },
        dialog: {
            title: th("host-dashboard.Оставьте отзыв"),
            write: th("host-dashboard.Напишите ваш отзыв"),
            needRating: th("host-dashboard.Поставьте оценку, чтобы оставить отзыв"),
            send: th("host-dashboard.Оставить отзыв"),
            sent: th("host-dashboard.Ваш отзыв был отправлен"),
            error: th("hostDescription.Произошла ошибка"),
            close: t("Закрыть"),
            rating: th("host-dashboard.Оставьте отзыв"),
            anonymous: t("Анонимный пользователь"),
            statuses,
            photo: { add: t("Добавить фото"), drop: t("Отпусти файлы здесь"), remove: t("Удалить"), photo: t("gallery.photo"), tooMany: t("Нельзя загрузить больше 10 файлов"), tooBig: t("Файл больше 5MB") },
        },
        // В старом строка была зашита по-русски, ключа в словарях нет
        statusError: "Не удалось изменить статус заявки",
    };
}
