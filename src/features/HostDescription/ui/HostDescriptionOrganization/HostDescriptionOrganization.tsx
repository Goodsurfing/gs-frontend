import { memo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import cn from "classnames";

import { MenuItem } from "@mui/material";

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

    const { control } = useFormContext();

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.name}>
                <InputControl
                    control={control}
                    name="mainInfo.organization"
                />
            </div>
            <div className={styles.oneSentence}>
                <TextAreaControl
                    label="Название организации"
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
                            label="Тип организации"
                        >
                            {organizationTypeData.map((item) => (
                                <MenuItem value={item.id} key={item.id}>{item.id}</MenuItem>
                            ))}
                        </SelectComponent>
                    )}
                />
                <InputControl
                    label="Другое"
                    name="type.otherOrganizationType"
                    control={control}
                />
            </div>
            <div className={styles.website}>
                <InputControl
                    label="Сайт организации"
                    name="mainInfo.website"
                    control={control}
                />
            </div>
            <div className={styles.about}>
                <TextAreaControl
                    name="mainInfo.aboutInfo"
                    label="Расскажите об организации"
                    description="Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"
                    control={control}
                />
            </div>
        </div>
    );
});
