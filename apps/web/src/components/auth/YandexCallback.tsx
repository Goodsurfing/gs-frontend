"use client";

import { useEffect, useRef, useState } from "react";

import { type Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { storageSet } from "@/lib/safeStorage";
import { completeSocialLogin, goAfterAuth, saveRegistrationConsent, type SocialLoginResponse } from "@/lib/socialLogin";
import {
    checkCallback, exchangeYandexCode, takeStoredFlow, YANDEX_CALLBACK_PATH, YANDEX_LINKED_FLASH,
    type YandexError, yandexErrorFromCheck, yandexErrorFromResponse, type YandexFlow,
} from "@/lib/yandexId";
import type { YandexCallbackLabels } from "@/lib/yandexIdLabels";
import { Loading } from "@/components/ui/Loading";

import { AuthMessage, outlinedLink } from "./AuthMessage";

type State =
    | { step: "working"; mode: YandexFlow["mode"]; locale: Locale }
    | { step: "error"; mode: YandexFlow["mode"]; locale: Locale; error: YandexError; backTo: string };

/** Язык, если поток не сохранился (вернулись в другой вкладке): по языку браузера */
function browserLocale(): Locale {
    const language = (typeof navigator !== "undefined" ? navigator.language : "").slice(0, 2);
    return language === "en" || language === "es" ? language : "ru";
}

/**
 * Возврат с Яндекса (/oauth/yandex, GS-336): проверить state, обменять код
 * на вход (POST /api/v1/oauth/yandex/login) или привязку (…/link) и вернуть
 * человека туда, откуда он ушёл. Страница общая для всех языков (адрес
 * возврата в Яндексе один) — язык и тексты берутся из сохранённого потока.
 */
export function YandexCallback({ labels }: { labels: Record<Locale, YandexCallbackLabels> }) {
    const [state, setState] = useState<State>({ step: "working", mode: "login", locale: "ru" });
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const flow = takeStoredFlow();
        const check = checkCallback(window.location.search, flow);
        // Код одноразовый: убрать его из адреса, чтобы обновление страницы не отправляло его снова
        window.history.replaceState(null, "", YANDEX_CALLBACK_PATH);
        const locale = flow?.locale ?? browserLocale();
        const mode = flow?.mode ?? "login";
        const fail = (error: YandexError) => setState({
            step: "error",
            mode,
            locale,
            error,
            backTo: flow?.backTo ?? routes.signIn(locale),
        });
        setState({ step: "working", mode, locale });
        if (!check.ok) {
            fail(yandexErrorFromCheck(check.reason));
            return;
        }
        const { flow: current, code } = check;
        void exchangeYandexCode(current.mode, code, current.verifier)
            .then(({ status, body }) => {
                if (status < 200 || status >= 300) {
                    fail(yandexErrorFromResponse(status, body));
                    return;
                }
                if (current.mode === "link") {
                    // Блок в настройках покажет «Яндекс ID привязан»
                    storageSet(YANDEX_LINKED_FLASH, "1", "session");
                    goAfterAuth(current.returnTo);
                    return;
                }
                const finished = completeSocialLogin(body as SocialLoginResponse, "yandex", () => {
                    void (async () => {
                        // С регистрации с отмеченным согласием на рассылку — сохранить его, как после VK
                        if (current.consentWording) await saveRegistrationConsent(current.consentWording);
                        goAfterAuth(current.returnTo);
                    })();
                });
                if (!finished) fail("unknown");
            })
            .catch(() => fail("unknown"));
    }, []);

    const text = labels[state.locale];
    if (state.step === "working") {
        return <Loading label={state.mode === "link" ? text.linking : text.loading} />;
    }
    return (
        <AuthMessage
            title={state.mode === "link" ? text.linkFailed : text.loginFailed}
            action={<a href={state.backTo} className={outlinedLink}>{state.mode === "link" ? text.backToSettings : text.backToSignIn}</a>}
        >
            <p role="alert">{text.errors[state.error]}</p>
        </AuthMessage>
    );
}
