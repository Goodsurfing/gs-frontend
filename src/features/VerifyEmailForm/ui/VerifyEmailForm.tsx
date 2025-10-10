import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import InputField from "@/components/InputField/InputField";
import { IVerifyFormData } from "@/types/api/auth/register.interface";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import Button from "@/shared/ui/Button/Button";
import styles from "./VerifyEmailForm.module.scss";

export const VerifyEmailForm = () => {
    const { t } = useTranslation("profile");
    const [toast] = useState<ToastAlert>();

    const { control, handleSubmit } = useForm<IVerifyFormData>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IVerifyFormData> = async () => {

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {toast && (
                <HintPopup text={toast.text} type={toast.type} />
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
            <Button
                type="submit"
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
                className={styles.btn}
            >
                {t("info.Подтвердить")}
            </Button>
        </form>
    );
};
