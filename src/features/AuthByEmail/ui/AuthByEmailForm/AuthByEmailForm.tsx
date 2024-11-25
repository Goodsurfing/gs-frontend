import cn from "classnames";

import { memo, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/shared/hooks/redux";
import { loginApi } from "../../model/services/loginApi/loginApi";

import { TOKEN_LOCALSTORAGE_KEY, USER_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { userActions } from "@/entities/User";

import styles from "./AuthByEmailForm.module.scss";
import InputField from "@/components/InputField/InputField";
import Button from "@/shared/ui/Button/Button";

import { LoginByEmailProps } from "../../model/types/login";
import { AuthByEmailHelp } from "../AuthByEmailHelp/AuthByEmailHelp";

interface AuthByEmailFormProps {
    className?: string;
    onSuccess?: () => void;
    onError?: () => void;
}

export const AuthByEmailForm = memo(({
    className,
    onSuccess,
    onError,
}: AuthByEmailFormProps) => {
    const { control, reset, handleSubmit } = useForm<LoginByEmailProps>({ mode: "onChange" });
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const [loginUser, { isLoading }] = loginApi.useLoginUserMutation();

    const onSubmit: SubmitHandler<LoginByEmailProps> = useCallback(async (data) => {
        try {
            const formData = {
                email: data.email,
                password: data.password,
            };
            const { accessToken } = await loginUser(formData).unwrap();

            dispatch(userActions.setAuthData({ username: data.email }));

            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({
                username: data.email,
            }));
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(accessToken));

            onSuccess?.();
            reset();
        } catch (e) {
            onError?.();
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
            <AuthByEmailHelp />
        </form>
    );
});
