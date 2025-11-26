import * as VKID from "@vkid/sdk";
import React, {
    FC, useEffect, useRef,
} from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Locale } from "@/entities/Locale";

import { generateCodeVerifier, generateState } from "@/shared/lib/pkce";

import styles from "./AuthByVk.module.scss";
import { BASE_VK_URI } from "@/shared/constants/api";
import { userActions } from "@/entities/User";
import { useAppDispatch } from "@/shared/hooks/redux";

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
    const { locale } = useLocale();
    const dispatch = useAppDispatch();
    const hasTriedAuth = useRef(false);
    const redirectUrl = process.env.NODE_ENV === "development"
        ? `https://localhost/${locale}/${redirect}`
        : `${process.env.REACT_APP_MAIN_URL}/${locale}/${redirect}`;

    useEffect(() => {
        if (hasTriedAuth.current) return;

        const vkIdInit = async () => {
            let codeVerifier = localStorage.getItem("vk_code_verifier");
            if (!codeVerifier) {
                codeVerifier = generateCodeVerifier();
                localStorage.setItem("vk_code_verifier", codeVerifier);
            }

            const state = generateState(32);

            VKID.Config.init({
                app: Number(process.env.REACT_VKID_CLIENT_ID),
                redirectUrl,
                scope: "email",
                codeVerifier,
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

            const tryAuth = async () => {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");
                const deviceId = urlParams.get("device_id");
                const responseType = urlParams.get("type");

                if (deviceId && code && responseType === "code_v2") {
                    const storedVerifier = localStorage.getItem("vk_code_verifier");
                    if (!storedVerifier) {
                        renderOneTapButton();
                        return;
                    }

                    try {
                        const responseAccessToken = await fetch(`${BASE_VK_URI}access-token`, {
                            method: "POST",
                            body: JSON.stringify({
                                code,
                                deviceId,
                                codeVerifier: storedVerifier,
                                redirectUri: redirectUrl,
                            }),
                        });
                        const { accessToken } = await responseAccessToken.json();

                        const responseJwtToken = await fetch(`${BASE_VK_URI}jwt-token`, {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });
                        const data = await responseJwtToken.json();

                        if (data) {
                            dispatch(userActions.setAuthData({
                                token: data.accessToken,
                                mercureToken: data.mercureToken,
                                rememberMe: true,
                                username: data.user.email,
                                roles: data.user.roles,
                            }));
                            localStorage.removeItem("vk_code_verifier");
                            onSuccess?.();
                        } else {
                            renderOneTapButton();
                        }
                    } catch (err) {
                        renderOneTapButton();
                    }
                } else {
                    renderOneTapButton();
                }
            };

            hasTriedAuth.current = true;
            await tryAuth();
        };

        vkIdInit();
    }, [locale, redirect, onSuccess, redirectUrl, dispatch]);

    return (
        <div className={styles.wrapper}>
            <div ref={containerRef} />
        </div>
    );
};
