"use client";

import { useEffect, useRef } from "react";

import type { Locale } from "@/i18n/config";
import { API_URL } from "@/lib/browserApi";
import { saveSession, type TokenResponse } from "@/lib/authSession";

const CLIENT_ID = Number(process.env.NEXT_PUBLIC_VKID_CLIENT_ID || "54505769");

const randomString = (length: number) => {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, (byte) => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[byte % 62]).join("");
};

/**
 * Вход через VK ID (AuthByVk старого фронта): кнопка One Tap; VK
 * возвращает на эту же страницу с ?code=&device_id=&type=code_v2, код
 * меняется на токен VK и затем на вход Гудсёрфинга (/api/v1/vk/…).
 * Адрес возврата — тот же, что у старого фронта (`/{язык}/signin|signup`):
 * он зарегистрирован в приложении VK.
 */
export function VkIdButton({ locale, page, onSuccess, onError, deletedText }: {
    locale: Locale;
    page: "signin" | "signup";
    onSuccess: () => void;
    onError: (message: string) => void;
    deletedText: string;
}) {
    const container = useRef<HTMLDivElement>(null);
    const tried = useRef(false);

    useEffect(() => {
        if (tried.current) return;
        tried.current = true;
        const redirectUrl = `${window.location.origin}/${locale}/${page}`;
        // Ошибки SDK и сети VK (блокировщики, нет связи) не должны ломать страницу — кнопки VK просто не будет
        void (async () => {
            const VKID = await import("@vkid/sdk");
            let verifier = window.localStorage.getItem("vk_code_verifier");
            if (!verifier) {
                verifier = randomString(64);
                window.localStorage.setItem("vk_code_verifier", verifier);
            }
            VKID.Config.init({ app: CLIENT_ID, redirectUrl, scope: "email", codeVerifier: verifier, state: randomString(32) });
            const render = () => {
                if (!container.current) return;
                container.current.innerHTML = "";
                const lang = { ru: VKID.Languages.RUS, en: VKID.Languages.ENG, es: VKID.Languages.SPA }[locale];
                new VKID.OneTap().render({ container: container.current, contentId: VKID.OneTapContentId.SIGN_IN, lang });
            };
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const deviceId = params.get("device_id");
            if (!code || !deviceId || params.get("type") !== "code_v2" || !window.localStorage.getItem("vk_code_verifier")) {
                render();
                return;
            }
            try {
                const vk = await fetch(`${API_URL}/api/v1/vk/access-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, deviceId, codeVerifier: verifier, redirectUri: redirectUrl }),
                }).then((response) => response.json() as Promise<{ accessToken?: string }>);
                const response = await fetch(`${API_URL}/api/v1/vk/jwt-token`, {
                    credentials: "include",
                    headers: { Authorization: `Bearer ${vk.accessToken}` },
                });
                if (response.status === 401) {
                    window.localStorage.removeItem("vk_code_verifier");
                    onError(deletedText);
                    render();
                    return;
                }
                const data = await response.json() as TokenResponse & { user?: { email?: string; roles?: string[] } };
                if (!data?.accessToken) {
                    render();
                    return;
                }
                saveSession({ ...data, roles: data.user?.roles ?? data.roles }, data.user?.email ?? "");
                window.localStorage.removeItem("vk_code_verifier");
                onSuccess();
            } catch {
                render();
            }
        })().catch(() => undefined);
    }, [locale, page, onSuccess, onError, deletedText]);

    return <div className="w-full max-w-[400px] pb-[30px]"><div ref={container} /></div>;
}
