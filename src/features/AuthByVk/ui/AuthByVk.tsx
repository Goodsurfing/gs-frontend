import * as VKID from "@vkid/sdk";
import React, { useEffect, useRef, useState } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Locale } from "@/entities/Locale";

import { generateCodeVerifier, generateState } from "@/shared/lib/pkce";

import styles from "./AuthByVk.module.scss";

const langLib: Record<Locale, VKID.Languages> = {
    ru: VKID.Languages.RUS,
    en: VKID.Languages.ENG,
    es: VKID.Languages.SPA,
};

export const AuthByVk = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const { locale } = useLocale();

    useEffect(() => {
        const vkIdInit = async () => {
            const codeVerifier = generateCodeVerifier();
            const state = generateState(32);

            console.log("state", state);
            console.log("verifier", codeVerifier);

            VKID.Config.init({
                app: Number(process.env.REACT_VKID_CLIENT_ID),
                redirectUrl:
                    process.env.NODE_ENV === "development"
                        ? `https://localhost/${locale}/signin`
                        : `${process.env.REACT_APP_MAIN_URL}/${locale}/signin`,
                scope: "email phone",
                codeVerifier: codeVerifier,
                // codeChallenge: challenge,
                state,
            });

            const renderOneTapButton = () => {
                if (!containerRef.current) return;
                containerRef.current.innerHTML = "";

                const oneTap = new VKID.OneTap();
                oneTap.render({
                    container: containerRef.current,
                    contentId: VKID.OneTapContentId.SIGN_IN,
                    lang: langLib[locale],
                });
            };

            const tryAuth = () => {
                const urlParams = new URLSearchParams(window.location.search);
                console.log("data params", urlParams);
                const code = urlParams.get("code");
                const deviceId = urlParams.get("device_id");
                const responseType = urlParams.get("type");

                console.log("code", code);

                if (deviceId && code && responseType === "code_v2") {
                    VKID.Auth.exchangeCode(code, deviceId)
                        .then((result: any) => {
                            setToken(result.access_token);
                            return VKID.Auth.userInfo(result.access_token);
                        })
                        .then((result: any) => setUser(result.user))
                        .then(() => {
                            window.history.replaceState(
                                {},
                                document.title,
                                window.location.pathname
                            );
                        })
                        .catch((e: any) =>
                            console.error("Ошибка Auth.exchangeCode()", e)
                        );
                } else {
                    renderOneTapButton();
                }
            };

            tryAuth();
        };

        vkIdInit();
    }, [locale]);

    const handleLogout = async () => {
        if (!token) return;

        try {
            await VKID.Auth.logout(token);
            setUser(null);
            setToken(null);
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при выходе из VKID:", error);
        }
    };

    return (
        <div className={styles.wrapper}>
            {!user && <div ref={containerRef} />}
            {user && (
                <div>
                    <p>Имя: {user.first_name}</p>
                    <p>Фамилия: {user.last_name}</p>
                    <p>Телефон: {user.phone}</p>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
};
