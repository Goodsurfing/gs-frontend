import React, {
    FC, useEffect,
} from "react";
import {
    Controller,
    DefaultValues, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import { Category, GetCategory } from "@/types/categories";

import Button from "@/shared/ui/Button/Button";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import styles from "./AdminCategoryForm.module.scss";

interface AdminCategoryFormProps {
    className?: string;
    category?: GetCategory;
    onSubmit?: (data: AdminCategoryFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminCategoryFields> = {
    name: "",
    color: "#000",
    imagePath: undefined,

};

export type AdminCategoryFields = Omit<Category, "id" | "imagePath"> & {
    imagePath?: File | string;
    nameEn: string;
    nameEs: string;
};

export const AdminCategoryForm: FC<AdminCategoryFormProps> = (props) => {
    const {
        className, category, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminCategoryFields>({
        mode: "onChange",
        defaultValues,
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<AdminCategoryFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                nameEn: category.nameEn || "",
                nameEs: category.nameEs || "",
                color: category.color || undefined,
                imagePath: category.imagePath || undefined,
            });
        } else {
            reset();
        }
    }, [category, reset]);

    return (
        <FormProvider {...form}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название категории (ru)"
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
                        label="Название категории (en)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEn"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.nameEn?.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Название категории (es)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEs"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.nameEs?.message}
                            className={styles.error}
                        />
                    )}
                    <div className={styles.field}>
                        <label className={styles.label}>Цвет категории</label>
                        <Controller
                            name="color"
                            rules={{ required: "Это поле является обязательным" }}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <input
                                    type="color"
                                    value={value || "#000000"}
                                    onChange={onChange}
                                    className={styles.colorInput}
                                />
                            )}
                        />
                        {errors.color?.message && (
                            <ErrorText text={errors.color.message} className={styles.error} />
                        )}
                    </div>
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
                                />
                            )}
                        />
                        {errors.imagePath?.message && (
                            <ErrorText text={errors.imagePath.message} className={styles.error} />
                        )}
                    </div>
                </div>
                <div>
                    <Button
                        type="submit"
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
