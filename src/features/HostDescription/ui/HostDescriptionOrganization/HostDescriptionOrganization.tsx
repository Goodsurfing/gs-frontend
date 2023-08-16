import { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import cn from "classnames";

import { InputControl } from "@/shared/ui/InputControl/InputControl";

import styles from "./HostDescriptionOrganization.module.scss";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";

interface HostDescriptionOrganizationProps {
    className?: string;
}

export const HostDescriptionOrganization = memo((props: HostDescriptionOrganizationProps) => {
    const { className } = props;

    const { control } = useFormContext();

    const data = useWatch({ control });
    console.log(data);
    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.name}>
                <InputControl
                    control={control}
                    name="organization"
                />
            </div>
            <div className={styles.oneSentence}>
                <TextAreaControl
                    label="Название организации"
                    name="shortOrganization"
                    control={control}
                />
            </div>
            <div className={styles.type} />
            <div className={styles.website}>
                <InputControl
                    name="organizationType"
                    control={control}
                />
            </div>
            <div className={styles.about}>
                <TextAreaControl
                    name="aboutInfo"
                    label="Расскажите об организации"
                    description="Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"
                    control={control}
                />
            </div>
        </div>
    );
});
