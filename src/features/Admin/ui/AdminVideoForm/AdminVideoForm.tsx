import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import { AdminVideoFileds } from "@/entities/Admin";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import styles from "./AdminVideoForm.module.scss";

interface AdminVideoFormProps {
    className?: string;
    initialData?: AdminVideoFileds;
    onSubmit?: (data: AdminVideoFileds) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminVideoFileds> = {
    name: "",
    description: "",
    author: null,
    isActive: false,
    url: "",
    image: null,
};

export const AdminVideoForm: FC<AdminVideoFormProps> = (props) => {
    const {
        className, initialData, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminVideoFileds>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm = (isActive: boolean): SubmitHandler<AdminVideoFileds> => (data) => {
        onSubmit?.({ ...data, isActive });
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset();
        }
    }, [initialData, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название видео"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="name"
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.name.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Ссылка на видео"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="url"
                        isError={!!errors.url?.message}
                    />
                    {errors?.url?.message && (
                        <ErrorText
                            text={errors.url.message}
                            className={styles.error}
                        />
                    )}
                    <TextAreaControl
                        label="Описание видео"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="description"
                        isError={!!errors.description?.message}
                    />
                    {errors?.description?.message && (
                        <ErrorText
                            text={errors.description.message}
                            className={styles.error}
                        />
                    )}
                    <div className={styles.field}>
                        <label className={styles.label}>Изображение</label>
                        <Controller
                            name="image"
                            rules={{
                                required: "Изображение обязательно",
                            }}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ImageDropzone
                                    value={value?.contentUrl}
                                    onChange={onChange}
                                    error={!!errors.image}
                                    accept={{
                                        "image/jpeg": [".jpeg", ".jpg"],
                                        "image/png": [".png"],
                                    }}
                                />
                            )}
                        />
                        {errors.image?.message && (
                            <ErrorText text={errors.image.message} className={styles.error} />
                        )}
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmitForm(true))}
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить и опубликовать"}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmitForm(false))}
                        color="GREEN"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить в черновики"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
