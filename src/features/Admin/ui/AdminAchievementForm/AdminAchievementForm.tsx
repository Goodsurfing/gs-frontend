import React, { FC, useEffect } from "react";
import {
    Controller, DefaultValues, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import { Achievement, GetAchievement } from "@/types/achievements";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import styles from "./AdminAchievementForm.module.scss";

interface AdminAchievementFormProps {
    className?: string;
    achievement?: GetAchievement;
    onSubmit?: (data: AdminAchievementFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<Achievement> = {
    imagePath: undefined,
    name: "",
};

export type AdminAchievementFields = Omit<Achievement, "id" | "imagePath"> & {
    imagePath?: File | string;
    nameEn: string;
    nameEs: string;
};

export const AdminAchievementForm: FC<AdminAchievementFormProps> = (props) => {
    const {
        className, achievement, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminAchievementFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<AdminAchievementFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (achievement) {
            reset({
                name: achievement.name || "",
                nameEn: achievement.nameEn || "",
                nameEs: achievement.nameEs || "",
                imagePath: achievement.imagePath || undefined,
            });
        } else {
            reset();
        }
    }, [achievement, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название навыка (ru)"
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
                    <InputControl
                        label="Название навыка (en)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEn"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.nameEn?.message}
                    />
                    {errors?.nameEn?.message && (
                        <ErrorText
                            text={errors.nameEn.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Название навыка (es)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEs"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.nameEn?.message}
                    />
                    {errors?.nameEn?.message && (
                        <ErrorText
                            text={errors.nameEn.message}
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
