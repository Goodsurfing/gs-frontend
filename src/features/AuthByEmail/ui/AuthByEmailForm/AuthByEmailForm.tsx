import cn from "classnames";

import { memo, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@/shared/hooks/redux";
import { loginApi } from "../../model/services/loginApi/loginApi";

import { TOKEN_LOCALSTORAGE_KEY, USER_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { userActions } from "@/entities/User";

import styles from "./AuthByEmailForm.module.scss";
import InputField from "@/components/InputField/InputField";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
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

    const dispatch = useAppDispatch();

    const [loginUser, { isLoading }] = loginApi.useLoginUserMutation();

    const onSubmit: SubmitHandler<LoginByEmailProps> = useCallback(async (data) => {
        try {
            const formData = {
                username: data.username,
                password: data.password,
            };
            const { token } = await loginUser(formData).unwrap();

            dispatch(userActions.setAuthData({ username: data.username }));

            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({
                username: data.username,
            }));
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify({ token }));

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
                name="username"
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
            <Button disabled={isLoading} type="submit" variant={Variant.PRIMARY}>
                Войти
            </Button>
            <AuthByEmailHelp />
        </form>
    );
});
