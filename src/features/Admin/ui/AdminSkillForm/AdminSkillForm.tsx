import React, { FC, useEffect, useState } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
} from "react-hook-form";
import styles from "./AdminSkillForm.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { AdminSkill, useGetSkillByIdQuery } from "@/entities/Admin";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface AdminSkillFormProps {
    skillId: number;
    className?: string;
}

const defaultValues: DefaultValues<AdminSkill> = {
    imagePath: "",
    name: "",
};

export const AdminSkillForm: FC<AdminSkillFormProps> = (props) => {
    const { skillId, className } = props;
    const { data: skillData, isLoading, isError } = useGetSkillByIdQuery(skillId);
    const [toast] = useState<ToastAlert>();
    const form = useForm<AdminSkill>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    useEffect(() => {
        if (skillData) {
            reset(skillData);
        } else {
            reset();
        }
    }, [reset, skillData]);

    const onSubmit = handleSubmit(() => {
        reset();
    });

    if (isError) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <h2>Произошла ошибка загрузки умения</h2>
            </div>
        );
    }

    if (!skillData || isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <FormProvider {...form} control={control}>
                <form onSubmit={onSubmit}>
                    <div className={styles.input}>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: "Это поле является обязательным" }}
                            render={({ field }) => (
                                <Input
                                    label="Название навыка"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    minLength={2}
                                    maxLength={50}
                                    isError={!!errors.name?.message}
                                />
                            )}
                        />
                        {errors.name?.message && (
                            <ErrorText text={errors.name.message} className={styles.error} />
                        )}
                    </div>
                    <div className={styles.input}>
                        {/* <Controller
                            control={control}
                            name="imagePath"
                            rules={{ required: "Это поле является обязательным" }}
                            render={() => {
                                // TODO: Input for upload images
                            }}
                        /> */}
                        {errors.imagePath?.message && (
                            <ErrorText text={errors.imagePath.message} className={styles.error} />
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
