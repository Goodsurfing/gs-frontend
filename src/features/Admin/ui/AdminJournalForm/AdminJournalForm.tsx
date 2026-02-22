import cn from "classnames";
import React, { FC, memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";
import { InputField } from "@/shared/ui/InputField/InputField";
import { Image } from "@/types/media";
import { UploadArticleCover } from "../AdminArticleForm/ui/UploadArticleCover/UploadArticleCover";
import styles from "./AdminJournalForm.module.scss";

interface AdminJournalFormProps {
    className?: string;
    initialData?: AdminJournalFormFields;
    onComplete: (data: AdminJournalFormFields) => void;
    isLoading: boolean;
}

export interface AdminJournalFormFields {
    image: Image;
    name: string;
    description: string;
    isActive: boolean;
}

export const AdminJournalForm: FC<AdminJournalFormProps> = memo(
    (props: AdminJournalFormProps) => {
        const {
            className, initialData, onComplete,
            isLoading,
        } = props;
        const {
            register,
            control,
            reset,
            handleSubmit,
            watch,
        } = useForm<AdminJournalFormFields>({
            mode: "onChange",
        });

        useEffect(() => {
            if (initialData) {
                reset(initialData);
            } else {
                reset();
            }
        }, [initialData, reset]);

        const onSubmit = (isActiveValue: boolean) => (data: AdminJournalFormFields) => {
            onComplete({
                ...data,
                isActive: isActiveValue,
            });
        };

        const currentIsActive = watch("isActive") ?? initialData?.isActive ?? false;

        return (
            <form className={cn(className, styles.wrapper)}>
                <div>
                    <Controller
                        name="image"
                        control={control}
                        rules={{
                            required: "Загрузите обложку",
                        }}
                        render={({ field, fieldState }) => (
                            <div className={styles.imgWrapper}>
                                <UploadArticleCover
                                    id="upload cover"
                                    img={field.value}
                                    onUpload={(img) => field.onChange(img)}
                                />
                                {fieldState.error && (
                                    <span className={styles.error}>
                                        {fieldState.error.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.title}>
                        Название журнала
                    </span>
                    <Controller
                        name="name"
                        rules={{
                            required: "Поле обязательно для заполнения",
                            minLength: {
                                value: 5,
                                message: "Заголовок слишком короткий",
                            },
                            maxLength: {
                                value: 150,
                                message: "Заголовок слишком большой",
                            },
                        }}
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputField
                                name="name"
                                register={register}
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                                variant="outlined"
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                placeholder="Заголовок журнала"
                                className={styles.input}
                            />
                        )}
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.title}>
                        Ссылка на calameo
                    </span>
                    <Controller
                        name="description"
                        rules={{
                            required: "Поле обязательно для заполнения",
                            minLength: {
                                value: 5,
                                message: "Заголовок слишком короткий",
                            },
                            maxLength: {
                                value: 150,
                                message: "Заголовок слишком большой",
                            },
                        }}
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputField
                                name="name"
                                register={register}
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                                variant="outlined"
                                value={field.value}
                                onChange={(event) => field.onChange(event.target.value)}
                                placeholder="Пример ссылки: https://www.calameo.com/books/0062425129fe69c6b7793"
                                className={styles.input}
                            />
                        )}
                    />
                </div>
                <div className={styles.containerButtons}>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit(!currentIsActive))}
                        color="BLUE"
                        variant="FILL"
                        size="SMALL"
                        disabled={isLoading}
                    >
                        {currentIsActive ? "Сохранить и распубликовать" : "Сохранить и опубликовать"}
                    </Button>
                </div>
            </form>
        );
    },
);
