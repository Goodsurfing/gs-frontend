import cn from "classnames";

import { memo, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch } from "@/shared/hooks/redux";
import { loginApi } from "../../model/services/loginApi/loginApi";

import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { userActions } from "@/entities/User";
import { loginActions } from "../../model/slice/loginSlice";

import styles from "./AuthByEmailForm.module.scss";
import InputField from "@/components/InputField/InputField";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import { LoginByEmailProps } from "../../model/types/loginSchema";
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
            const { token } = await loginUser({
                username: data.username,
                password: data.password,
            }).unwrap();
            dispatch(userActions.setAuthData({ username: data.username }));
            dispatch(loginActions.setAuthData({ token }));
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token));
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
