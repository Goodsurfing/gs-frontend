import cn from "classnames";

import { memo, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/shared/hooks/redux";

import { userActions } from "@/entities/User";

import styles from "./AuthByEmailForm.module.scss";
import InputField from "@/components/InputField/InputField";
import Button from "@/shared/ui/Button/Button";

import { AuthByEmailHelp } from "../AuthByEmailHelp/AuthByEmailHelp";
import { authApi } from "@/store/api/authApi";
import { LoginByEmailFields } from "@/types/api/auth/login.interface";
import { getErrorText } from "@/shared/lib/getErrorText";

interface AuthByEmailFormProps {
    className?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export const AuthByEmailForm = memo(({
    className,
    onSuccess,
    onError,
}: AuthByEmailFormProps) => {
    const { control, reset, handleSubmit } = useForm<LoginByEmailFields>({ mode: "onChange" });
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [loginUser, { isLoading }] = authApi.useLoginUserMutation();

    const onSubmit: SubmitHandler<LoginByEmailFields> = useCallback(async (data) => {
        try {
            const formData = {
                email: data.email,
                password: data.password,
            };
            const { accessToken, mercureToken } = await loginUser(formData).unwrap();

            dispatch(userActions.setAuthData({
                username: data.email,
                token: accessToken,
                mercureToken,
                rememberMe: data.rememberMe,
            }));

            onSuccess?.();
            reset();
        } catch (e: any) {
            onError?.(getErrorText(e));
        }
    }, [dispatch, loginUser, onError, onSuccess, reset]);

    return (
        <form className={cn(styles.form, className)} onSubmit={handleSubmit(onSubmit)}>
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
                        text={t("login.Пароль")}
                    />
                )}
            />
            <Button
                disabled={isLoading}
                type="submit"
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                {t("login.Войти")}
            </Button>
            <Controller
                control={control}
                name="rememberMe"
                render={({ field }) => (
                    <AuthByEmailHelp value={field.value} onChange={field.onChange} />
                )}
            />
        </form>
    );
});
