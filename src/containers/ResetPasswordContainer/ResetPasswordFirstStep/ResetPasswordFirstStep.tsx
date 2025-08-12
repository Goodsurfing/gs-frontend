import InputField from "@/components/InputField/InputField";
import { authApi } from "@/store/api/authApi";
import { IResetPasswordRequestFormData } from "@/types/api/auth/resetPassword.interface";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";

import styles from "./ResetPasswordFirstStep.module.scss";

interface ResetPasswordFirstStepProps {
    changeStep: (email: string) => void;
}

const ResetPasswordFirstStep: FC<ResetPasswordFirstStepProps> = ({
    changeStep,
}) => {
    const { control, reset, handleSubmit } =
        useForm<IResetPasswordRequestFormData>({
            mode: "onChange",
        });
    const { t } = useTranslation();

    const [resetPasswordRequest, { error }] =
        authApi.useResetPasswordRequestMutation();

    const onSubmit: SubmitHandler<IResetPasswordRequestFormData> = async (
        data
    ) => {
        await resetPasswordRequest(data)
            .unwrap()
            .then(() => {
                changeStep(data.email);
                reset();
            })
            .catch(() => {
                // empty
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {error && (
                <HintPopup text={getErrorText(error)} type={HintType.Error} />
            )}
            <Controller
                control={control}
                name="email"
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
            <Button type="submit" variant="FILL" color="BLUE" size="MEDIUM">
                {t("login.Отправить")}
            </Button>
        </form>
    );
};

export default ResetPasswordFirstStep;
