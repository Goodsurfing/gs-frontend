import { useState, memo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";

import Checkbox from "@/components/Checkbox/Checkbox";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import InputField from "@/components/InputField/InputField";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useAppDispatch } from "@/shared/hooks/redux";

import tokenStorage from "@/shared/utils/storage/TokenStorage";

import { authApi } from "@/store/api/authApi";
import { setLoginUserData } from "@/store/reducers/loginSlice";
import { IToast } from "@/store/reducers/toastSlice";

import { IAuthLoginData } from "@/types/api/auth/login.interface";

import styles from "./SignInForm.module.scss";
import { getMainPageUrl, getResetPasswordPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "@/shared/ui/Preloader/Preloader";

const SignInForm = memo(() => {
    const [loginUser, { isError, isLoading }] = authApi.useLoginUserMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const [toast, setToast] = useState<IToast>();

    const [isRemember, setIsRemember] = useState<boolean>(true);
    const { control, reset, handleSubmit } = useForm<IAuthLoginData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IAuthLoginData> = async (data) => {
        loginUser(data)
            .unwrap()
            .then((res) => {
                dispatch(setLoginUserData(res));
                tokenStorage.setToken(res.token);
                navigate(getMainPageUrl(locale));
                reset();
            })
            .catch((err) => {
                console.error("Неверные данные");
                setToast({
                    text: "Неверный логин или пароль",
                    type: HintType.Error,
                });
            });
    };

    const checkboxHandleClick = () => {
        setIsRemember(!isRemember);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {isError && toast && (
                <HintPopup type={HintType.Error} text="Произошла ошибка" />
            )}
            {isLoading && (
                <Preloader className={styles.loader} />
            )}
            <Controller
                control={control}
                name="username"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type="email"
                        text="E-mail"
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={(e) => field.onChange(e)}
                        value={field.value}
                        type="password"
                        text="Пароль"
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
                Войти
            </Button>

            <div className={styles.help}>
                <Checkbox
                    isChecked={isRemember}
                    onChange={checkboxHandleClick}
                    text="Запомнить меня"
                />
                <LocaleLink
                    to={getResetPasswordPageUrl(locale)}
                    className={styles.forget}
                >
                    Забыли пароль?
                </LocaleLink>
            </div>
        </form>
    );
});

export default SignInForm;
