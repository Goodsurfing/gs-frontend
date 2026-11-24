import type { IosInstallHintLabels } from "@/components/pwa/IosInstallHint";
import type { InstallStepsLabels } from "@/components/pwa/InstallSteps";
import type { Translate } from "@/i18n/dictionary";

/** Шаги «Установить на iPhone» (словарь pwa) — общие для плашки и страницы /app */
export const installStepsLabels = (t: Translate): InstallStepsLabels => ({
    share: t("steps.share"),
    addToHome: t("steps.addToHome"),
    add: t("steps.add"),
    open: t("steps.open"),
});

/** Подписи плашки «Установите Гудсёрфинг на iPhone» (словарь pwa) */
export const iosInstallHintLabels = (t: Translate): IosInstallHintLabels => ({
    text: t("hint.text"),
    how: t("hint.how"),
    later: t("hint.later"),
    title: t("hint.title"),
    note: t("hint.note"),
    more: t("hint.more"),
    close: t("hint.close"),
    steps: installStepsLabels(t),
});
