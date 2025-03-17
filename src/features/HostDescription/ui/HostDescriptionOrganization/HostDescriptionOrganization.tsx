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

interface HostDescriptionOrganizationProps {
    className?: string;
}

export const HostDescriptionOrganization = memo((props: HostDescriptionOrganizationProps) => {
    const { className } = props;
    const { t } = useTranslation("host");

    const { control } = useFormContext();

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.name}>
                <InputControl
                    label={t("hostDescription.Название организации")}
                    control={control}
                    name="mainInfo.organization"
                />
            </div>
            <div className={styles.oneSentence}>
                <TextAreaControl
                    label={t("hostDescription.Опишите организацию в одно предложение")}
                    name="mainInfo.shortOrganization"
                    control={control}
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
                    control={control}
                />
            </div>
        </div>
    );
});
