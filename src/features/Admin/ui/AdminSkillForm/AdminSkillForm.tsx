import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { Skill } from "@/types/skills";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import styles from "./AdminSkillForm.module.scss";

interface AdminSkillFormProps {
    className?: string;
    skill?: Skill;
    onSubmit?: (data: AdminSkillFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<Skill> = {
    imagePath: undefined,
    name: "",
};

export type AdminSkillFields = Omit<Skill, "id" | "imagePath"> & {
    imagePath?: File | string;
};

export const AdminSkillForm: FC<AdminSkillFormProps> = (props) => {
    const {
        className, skill, onSubmit, isLoading,
    } = props;

    const form = useForm<Skill>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<AdminSkillFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (skill) {
            reset({
                name: skill.name || "",
                imagePath: skill.imagePath || undefined,
            });
        } else {
            reset();
        }
    }, [skill, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название навыка"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="name"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.name.message}
                            className={styles.error}
                        />
                    )}
                    <div className={styles.field}>
                        <label className={styles.label}>Изображение</label>
                        <Controller
                            name="imagePath"
                            rules={{
                                required: "Изображение обязательно",
                            }}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ImageDropzone
                                    value={value}
                                    onChange={onChange}
                                    error={!!errors.imagePath}
                                    accept={{
                                        "image/svg+xml": [".svg"],
                                    }}
                                />
                            )}
                        />
                        {errors.imagePath?.message && (
                            <ErrorText text={errors.imagePath.message} className={styles.error} />
                        )}
                        <p>Загружать только SVG формат</p>
                    </div>
                </div>
                <Button
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                    variant="FILL"
                    disabled={isLoading}
                >
                    {isLoading ? "Идёт сохранение" : "Сохранить"}
                </Button>
            </form>
        </FormProvider>
    );
};
