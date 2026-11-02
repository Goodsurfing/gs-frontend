import type { ImagesUploaderLabels } from "@/components/cabinet/ImagesUploader";
import type { Translate } from "@/i18n/dictionary";

/** Подписи просмотрщика фото (те же ключи, что на публичных страницах) */
export const galleryLabels = (t: Translate) => ({ close: t("Закрыть"), photo: t("gallery.photo"), prev: t("slider.previous"), next: t("slider.next") });

/** Подписи загрузчика фото и файлов (ImagesUploader старого фронта: общий словарь) */
export function uploaderLabels(t: Translate, add: "Добавить фото" | "Добавить сертификат" = "Добавить фото"): ImagesUploaderLabels {
    return {
        add: t(add),
        drop: t("Отпусти файлы здесь"),
        tooMany: t("Нельзя загрузить больше 10 файлов"),
        tooBig: t("Файл больше 5MB"),
        remove: t("Удалить"),
        gallery: galleryLabels(t),
    };
}
