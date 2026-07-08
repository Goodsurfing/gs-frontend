import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

type TFunction = (key: string, opts?: Record<string, unknown>) => string;

/**
 * Регресс-фикс PR gs-frontend#349 (v0.1.26): onSubmitDescription молча
 * выходил (return без обратной связи), если coverImage.id ещё не пришёл
 * (фото грузится/не загрузилось) — пользователь жал "Сохранить", ничего не
 * происходило. Теперь вместо тихого отказа — явный тост с ошибкой.
 */
export function getMissingCoverImageToast(
    coverImage: { id?: string } | null | undefined,
    t: TFunction,
): { text: string; type: HintType } | null {
    if (coverImage?.id) {
        return null;
    }

    return {
        text: t("hostFundraiseDescription.imageNotUploaded", {
            defaultValue: "Дождитесь загрузки фото обложки перед сохранением",
            ns: "host",
        }),
        type: HintType.Error,
    };
}
