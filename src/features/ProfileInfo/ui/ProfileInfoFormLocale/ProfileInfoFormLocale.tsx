import { memo } from "react";
import cn from "classnames";
import { Controller, useFormContext } from "react-hook-form";

import { SelectComponent } from "@/shared/ui/Select/Select";
import { useAppSelector } from "@/shared/hooks/redux";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormLocale.module.scss";

interface ProfileInfoFormLocaleProps {
    className?: string;
}

export const ProfileInfoFormLocale = memo((props: ProfileInfoFormLocaleProps) => {
    const { className } = props;
    const { control } = useFormContext();

    const isLocked = useAppSelector(getProfileReadonly);

    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name=""
                control={control}
                // defaultValue={}
                render={({ field }) => (
                    <SelectComponent
                        disabled={isLocked}
                        className={styles.dropdown}
                        onChange={field.onChange}
                        value={field.value}
                        label="Страна"
                    >
                        {}
                    </SelectComponent>
                )}
            />
        </div>
    );
});
