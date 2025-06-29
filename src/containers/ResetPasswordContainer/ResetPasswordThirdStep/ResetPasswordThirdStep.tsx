import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/ui/Button/Button";

import InputField from "@/components/InputField/InputField";

import useQuery from "@/shared/hooks/useQuery";

import styles from "./ResetPasswordThirdStep.module.scss";
import { authApi } from "@/store/api/authApi";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getErrorText } from "@/shared/lib/getErrorText";

interface IFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordThirdStep: FC = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const [resetPasswordVerify, { error }] = authApi.useResetPasswordVerifyMutation();
    const { locale } = useLocale();

    const { control, handleSubmit, reset } = useForm<IFormData>({
        mode: "onChange",
    });

    useEffect(() => {
        if (!query.get("token")) {
            navigate(getMainPageUrl(locale));
        }
    }, [navigate, query, locale]);

    const onSubmit = async (data: IFormData) => {
        const token = query.get("token");
        if (!token) {
            return;
        }
        if (data.password !== data.confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }
        await resetPasswordVerify({
            token,
            password: data.password,
        })
            .unwrap()
            .then(() => {
                navigate(getMainPageUrl(locale));
                reset();
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error && <HintPopup text={getErrorText(error)} type={HintType.Error} />}
            <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type="password"
                        text="Новый пароль"
                    />
                )}
            />
            <Controller
                control={control}
                name="confirmPassword"
                defaultValue=""
                render={({ field }) => (
                    <InputField
                        onChange={field.onChange}
                        value={field.value}
                        type="password"
                        text="Повторите новый пароль"
                    />
                )}
            />

            <Button
                type="submit"
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                Отправить
            </Button>
        </form>
    );
};

export default ResetPasswordThirdStep;
