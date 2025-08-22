import * as VKID from "@vkid/sdk";
import React, {
    FC, useEffect, useRef, useState,
} from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Locale } from "@/entities/Locale";

import { generateCodeVerifier, generateState } from "@/shared/lib/pkce";

import styles from "./AuthByVk.module.scss";

const langLib: Record<Locale, VKID.Languages> = {
    ru: VKID.Languages.RUS,
    en: VKID.Languages.ENG,
    es: VKID.Languages.SPA,
};

interface AuthByVkProps {
    redirect: string;
    onSuccess?: () => void;
}

export const AuthByVk: FC<AuthByVkProps> = (props) => {
    const { redirect, onSuccess } = props;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const { locale } = useLocale();

    useEffect(() => {
        const vkIdInit = async () => {
            const codeVerifier = generateCodeVerifier();
            const state = generateState(32);

            VKID.Config.init({
                app: Number(process.env.REACT_VKID_CLIENT_ID),
                redirectUrl:
                    process.env.NODE_ENV === "development"
                        ? `https://localhost/${locale}/${redirect}`
                        : `${process.env.REACT_APP_MAIN_URL}/${locale}/${redirect}`,
                scope: "email phone",
                codeVerifier,
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

                const code = urlParams.get("code");
                const deviceId = urlParams.get("device_id");
                const responseType = urlParams.get("type");

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
                                window.location.pathname,
                            );
                            onSuccess?.();
                        })
                        .catch((e: any) => console.error("Ошибка Auth.exchangeCode()", e));
                } else {
                    renderOneTapButton();
                }
            };

            tryAuth();
        };

        vkIdInit();
    }, [locale, redirect, onSuccess]);

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
                    <p>
                        Имя:
                        {user.first_name}
                    </p>
                    <p>
                        Фамилия:
                        {user.last_name}
                    </p>
                    <p>
                        Телефон:
                        {user.phone}
                    </p>
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
};
