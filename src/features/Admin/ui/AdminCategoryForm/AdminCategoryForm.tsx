import React, {
    FC, useEffect, useState,
} from "react";
import {
    Controller,
    DefaultValues, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import { Category } from "@/types/categories";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { useCreateCategoryVacancyMutation } from "@/entities/Admin";
import Button from "@/shared/ui/Button/Button";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import styles from "./AdminCategoryForm.module.scss";

interface AdminCategoryFormProps {
    className?: string;
    category?: Category;
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<AdminCategoryFields> = {
    name: "",
    color: "#000",
    imagePath: undefined,

};

type AdminCategoryFields = Omit<Category, "id" | "imagePath"> & {
    imagePath?: File | string;
};

export const AdminCategoryForm: FC<AdminCategoryFormProps> = (props) => {
    const { className, category, onSuccess } = props;

    const [toast, setToast] = useState<ToastAlert>();
    const [createCategory, { isLoading }] = useCreateCategoryVacancyMutation();

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

    const onSubmit: SubmitHandler<AdminCategoryFields> = async (data) => {
        try {
            const { name, color, imagePath: imageFile } = data;

            if (imageFile instanceof File) {
                await createCategory({
                    name,
                    color,
                    image: imageFile,
                }).unwrap();
                onSuccess?.();
            }
        } catch (err) {
            setToast({ text: "Не удалось сохранить категорию", type: HintType.Error });
        }
    };

    useEffect(() => {
        if (category) {
            reset({
                name: category.name || "",
                color: category.color || undefined,
                imagePath: category.imagePath || undefined,
            });
        } else {
            reset();
        }
    }, [category, reset]);

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название категории"
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
                        Сохранить
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
