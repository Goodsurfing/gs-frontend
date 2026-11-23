import type { EmailChangeLabels } from "@/components/email-change/EmailChangeButton";
import type { EmailChangeLinkLabels } from "@/components/email-change/EmailChangeLink";
import type { Translate } from "@/i18n/dictionary";
import { EMAIL_CHANGE_ERRORS } from "@/lib/emailChange";

function errors(t: Translate): EmailChangeLabels["errors"] {
    const all = [...EMAIL_CHANGE_ERRORS, "network"] as const;
    return Object.fromEntries(all.map((code) => [code, t(`emailChange.errors.${code}`)])) as EmailChangeLabels["errors"];
}

/** Подписи блока «Изменить почту» в профиле; {{email}} и {{date}} подставляет компонент */
export function emailChangeLabels(t: Translate): EmailChangeLabels {
    const k = (key: string) => t(`emailChange.${key}`, { email: "{{email}}", date: "{{date}}" });
    return {
        change: k("change"),
        title: k("title"),
        text: k("text"),
        newEmail: k("newEmail"),
        password: k("password"),
        passwordHint: k("passwordHint"),
        vkHint: k("vkHint"),
        submit: k("submit"),
        cancel: k("cancel"),
        sent: k("sent"),
        pending: k("pending"),
        close: k("close"),
        signInAgain: k("signInAgain"),
        errors: errors(t),
    };
}

export function emailChangeLinkLabels(t: Translate, mode: "confirm" | "revert"): EmailChangeLinkLabels {
    const k = (key: string) => t(`emailChange.${mode}.${key}`, { email: "{{email}}" });
    return {
        title: k("title"),
        text: k("text"),
        button: k("button"),
        doneTitle: k("doneTitle"),
        doneText: k("doneText"),
        doneButton: k("doneButton"),
        missing: t("emailChange.missing"),
        errors: errors(t),
    };
}
