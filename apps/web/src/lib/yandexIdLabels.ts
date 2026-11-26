import type { Translate } from "@/i18n/dictionary";
import { YANDEX_ERRORS, type YandexError } from "@/lib/yandexId";

/** Тексты ошибок Яндекс ID; удалённый аккаунт — тот же текст, что у VK */
export function yandexErrorLabels(t: Translate): Record<YandexError, string> {
    return Object.fromEntries(YANDEX_ERRORS.map((code) => [
        code,
        code === "deleted" ? t("login.Пользователь был удален или не создавался") : t(`yandexId.errors.${code}`),
    ])) as Record<YandexError, string>;
}

/** Кнопка на входе и регистрации */
export function yandexButtonLabels(t: Translate) {
    return { label: t("yandexId.signIn"), unavailable: t("yandexId.unavailable") };
}

export type YandexCallbackLabels = {
    loading: string;
    linking: string;
    loginFailed: string;
    linkFailed: string;
    backToSignIn: string;
    backToSettings: string;
    errors: Record<YandexError, string>;
};

/** Страница-колбэк /oauth/yandex */
export function yandexCallbackLabels(t: Translate): YandexCallbackLabels {
    const k = (key: string) => t(`yandexId.callback.${key}`);
    return {
        loading: k("loading"),
        linking: k("linking"),
        loginFailed: k("loginFailed"),
        linkFailed: k("linkFailed"),
        backToSignIn: k("backToSignIn"),
        backToSettings: k("backToSettings"),
        errors: yandexErrorLabels(t),
    };
}

export type YandexSettingsLabels = {
    title: string;
    linked: string;
    notLinked: string;
    link: string;
    unlink: string;
    cannotUnlink: string;
    linkedOk: string;
    unlinkedOk: string;
    unavailable: string;
    errors: Record<YandexError, string>;
};

/** Блок «Вход через Яндекс ID» в настройках профиля */
export function yandexSettingsLabels(t: Translate): YandexSettingsLabels {
    const k = (key: string) => t(`yandexId.settings.${key}`);
    return {
        title: k("title"),
        linked: k("linked"),
        notLinked: k("notLinked"),
        link: k("link"),
        unlink: k("unlink"),
        cannotUnlink: k("cannotUnlink"),
        linkedOk: k("linkedOk"),
        unlinkedOk: k("unlinkedOk"),
        unavailable: t("yandexId.unavailable"),
        errors: yandexErrorLabels(t),
    };
}
