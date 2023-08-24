import { memo } from "react";
import cn from "classnames";
import { Controller, useFormContext } from "react-hook-form";

import { useAppSelector } from "@/shared/hooks/redux";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { getProfileReadonly } from "@/entities/Profile";

import styles from "./ProfileInfoFormBirthDate.module.scss";

interface ProfileInfoFormBirthDateProps {
    className?: string;
}

export const ProfileInfoFormBirthDate = memo((props: ProfileInfoFormBirthDateProps) => {
    const { className } = props;
    const isLocked = useAppSelector(getProfileReadonly);
    const { control } = useFormContext();
    return (
        <div className={cn(className, styles.wrapper)}>
            <Controller
                name=""
                control={control}
                render={({ field }) => (
                    <SelectComponent disabled={isLocked} value={field.value}>
                        
                    </SelectComponent>
                )}
            />
        </div>
    );
});
