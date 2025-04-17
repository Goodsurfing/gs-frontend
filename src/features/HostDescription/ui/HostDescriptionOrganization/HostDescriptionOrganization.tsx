import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import cn from "classnames";

import { MenuItem } from "@mui/material";

import { useTranslation } from "react-i18next";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { organizationTypeData } from "../../model/data/organizationTypeData";

import styles from "./HostDescriptionOrganization.module.scss";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { HostDescriptionFormFields } from "../../model/types/hostDescription";

interface HostDescriptionOrganizationProps {
    className?: string;
}

export const HostDescriptionOrganization = memo((props: HostDescriptionOrganizationProps) => {
    const { className } = props;
    const { t } = useTranslation("host");

    const { control, formState: { errors } } = useFormContext<HostDescriptionFormFields>();

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.name}>
                <InputControl
                    label={t("hostDescription.Название организации")}
                    rules={{ required: t("hostDescription.Это поле является обязательным") }}
                    control={control}
                    name="mainInfo.organization"
                    minLength={3}
                    maxLength={60}
                />
                {errors.mainInfo?.organization?.message && (
                    <ErrorText
                        text={errors.mainInfo.organization.message}
                        className={styles.error}
                    />
                )}
            </div>
            <div className={styles.oneSentence}>
                <TextAreaControl
                    label={t("hostDescription.Опишите организацию в одно предложение")}
                    name="mainInfo.shortOrganization"
                    control={control}
                    description={t("hostDescription.Не более 200 знаков")}
                    maxLength={200}
                />
            </div>
            <div className={styles.type}>
                <Controller
                    name="type.organizationType"
                    control={control}
                    defaultValue={organizationTypeData[0].id}
                    render={({ field }) => (
                        <SelectComponent
                            className={styles.dropdown}
                            onChange={field.onChange}
                            value={field.value}
                            label={t("hostDescription.Тип организации")}
                        >
                            {organizationTypeData.map((item) => (
                                <MenuItem value={item.id} key={item.id}>{item.id}</MenuItem>
                            ))}
                        </SelectComponent>
                    )}
                />
                <InputControl
                    label={t("hostDescription.Другое")}
                    name="type.otherOrganizationType"
                    control={control}
                    maxLength={1000}
                />
            </div>
            <div className={styles.website}>
                <InputControl
                    label={t("hostDescription.Сайт организации")}
                    name="mainInfo.website"
                    control={control}
                />
            </div>
            <div className={styles.about}>
                <TextAreaControl
                    name="mainInfo.aboutInfo"
                    label={t("hostDescription.Расскажите об организации")}
                    description={t("hostDescription.Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия")}
                    extraDescription={t("hostDescription.Не более 1000 знаков")}
                    control={control}
                />
            </div>
        </div>
    );
});
