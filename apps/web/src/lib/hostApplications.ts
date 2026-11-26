import "server-only";

import type { ApplicationCardLabels } from "@/components/cabinet/host/ApplicationCard";
import type { HostReviewDialogLabels } from "@/components/cabinet/host/HostReviewDialog";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import type { PluralText } from "@/lib/applicationsView";

/** Подписи карточки заявки и окна отзыва — общие для рабочего стола и «Заявок» */
export async function applicationLabels(locale: Locale): Promise<{ card: ApplicationCardLabels; dialog: HostReviewDialogLabels; statusError: string; waiting: PluralText; reply: string }> {
    const [t, th, tm] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "messenger")]);
    const n = (key: string) => th(`hostNotes.${key}`);
    const statuses = { new: t("notes.new"), accepted: t("notes.accepted"), canceled: t("notes.canceled") };
    return {
        card: {
            // В карточке — про одну заявку: «Новая», «Принята», «Отклонена»
            statuses: { new: n("status.new"), accepted: n("status.accepted"), canceled: n("status.canceled") },
            accept: t("notes.Принять"),
            reject: t("notes.Отклонить"),
            rejectConfirm: tm("Отклонить заявку? Волонтёр получит уведомление"),
            cancel: tm("Отмена"),
            reply: n("Ответить"),
            message: n("Написать"),
            openChat: n("Открыть переписку"),
            writeReview: t("notes.Написать отзыв"),
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
        waiting: { one: n("waiting_one"), few: n("waiting_few"), many: n("waiting_many"), other: n("waiting_other") },
        reply: n("Ответить"),
    };
}
