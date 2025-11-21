import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getAdminUsersPageUrl } from "@/shared/config/routes/AppUrls";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import { LoginAdminFields } from "@/types/api/auth/login.interface";
import InputField from "@/components/InputField/InputField";
import Button from "@/shared/ui/Button/Button";
import styles from "./AdminAuth.module.scss";
import Checkbox from "@/components/Checkbox/Checkbox";
import { authApi } from "@/store/api/authApi";
import { useAppDispatch } from "@/shared/hooks/redux";
import { userActions } from "@/entities/User";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const AdminAuth = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { refetchProfile } = useAuth();
    const [error, setError] = useState("");

    const [login, { isLoading }] = authApi.useLoginUserMutation();

    const dispatch = useAppDispatch();

    const { control, reset, handleSubmit } = useForm<LoginAdminFields>({ mode: "onChange" });

    const onSuccess = useCallback(() => {
        refetchProfile();
        navigate(getAdminUsersPageUrl(locale));
    }, [locale, navigate, refetchProfile]);

    const onError = useCallback((errorText: string) => {
        setError(errorText);
    }, []);

    const onSubmit: SubmitHandler<LoginAdminFields> = useCallback(async (data) => {
        const { email, password, rememberMe } = data;
        try {
            const { accessToken, mercureToken, roles } = await login({ email, password }).unwrap();

            dispatch(userActions.setAuthData({
                username: data.email,
                token: accessToken,
                mercureToken,
                rememberMe,
                roles,
                isVerified: true,
            }));
            onSuccess();
        } catch {
            onError("Произошла ошибка");
        }
        reset();
    }, [onSuccess, reset, login, dispatch, onError]);

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => setError(""), 4000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    return (
        <div className={styles.wrapper}>
            {error && (
                <HintPopup
                    text={error}
                    type={HintType.Error}
                />
            )}
            <h2 className={styles.title}>Войти в панель администратора</h2>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value || ""}
                            type="email"
                            text="E-mail"

                        />
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value || ""}
                            type="password"
                            text="Пароль"
                        />
                    )}
                />
                <Button
                    type="submit"
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    disabled={isLoading}
                >
                    Войти
                </Button>
                <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                        <div className={styles.checkbox}>
                            <Checkbox
                                isChecked={field.value}
                                onChange={() => field.onChange(!field.value)}
                                text="Запомнить меня"
                            />
                        </div>
                    )}
                />
            </form>
        </div>
    );
};
