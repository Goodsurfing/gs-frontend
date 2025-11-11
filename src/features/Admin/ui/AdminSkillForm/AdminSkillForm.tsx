import React, { FC } from "react";
import cn from "classnames";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./AdminSkillForm.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface AdminSkillFormProps {
    skillData: any;
    className?: string;
}

interface SkillType {
    id: number;
    name: string;
    img: string;
}

export const AdminSkillForm: FC<AdminSkillFormProps> = (props) => {
    const { skillData, className } = props;
    const form = useForm<ProfileInfoFields>({
        mode: "onChange",
        defaultValues: profileInfoFormAdapter(profile),
    });

    return (
        <div className={cn(styles.wrapper, className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <FormProvider {...form} control={control} />
        </div>
    );
};
