import cn from "classnames";
import React, { FC, memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OfferCategories } from "@/widgets/OfferCategories";

import Button from "@/shared/ui/Button/Button";
import { InputField } from "@/shared/ui/InputField/InputField";
import { TextEditor } from "@/shared/ui/TextEditor/TextEditor";
import { UploadArticleCover } from "../UploadArticleCover/UploadArticleCover";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Image } from "@/types/media";
import styles from "./AdminArticleForm.module.scss";
import { AdminUsersSearchForm } from "../../../AdminUsersSearchForm/ui/AdminUsersSearchForm/AdminUsersSearchForm";

interface AdminArticleFormProps {
    className?: string;
    initialData?: AdminArticleFormFields;
    onComplete: (data: AdminArticleFormFields) => void;
    onErrorUploadImage: (error: string) => void;
    isLoading: boolean;
}

export interface AdminArticleFormFields {
    image: Image;
    name: string;
    categoryId: number;
    description: string;
    author: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    }
    isActive: boolean;
}

export const AdminArticleForm: FC<AdminArticleFormProps> = memo(
    (props: AdminArticleFormProps) => {
        const {
            className, initialData, onComplete,
            isLoading, onErrorUploadImage,
        } = props;
        const { t } = useTranslation("volunteer");
        const { locale } = useLocale();
        const {
            register,
            formState: { errors },
            control,
            reset,
            handleSubmit,
        } = useForm<AdminArticleFormFields>({
            mode: "onChange",
        });

        useEffect(() => {
            if (initialData) {
                reset(initialData);
            } else {
                reset();
            }
        }, [initialData, reset]);

        const onSubmit = (isActive: boolean) => (data: AdminArticleFormFields) => {
            onComplete({
                ...data,
                isActive,
            });
        };

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
                    <span className={styles.smallDescription}>
                        {t(
                            "volunteer-create-article.Оптимальные размеры 2175 х 966. Вес не более 2МБ",
                        )}
                    </span>
                </div>
                <div className={styles.field}>
                    <span className={styles.title}>
                        {t("volunteer-create-article.Название статьи")}
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
                                placeholder={t(
                                    "volunteer-create-article.Заголовок вашей статьи",
                                )}
                                className={styles.input}
                            />
                        )}
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.title}>
                        {t("volunteer-create-article.Категория статьи")}
                    </span>
                    <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: "Выберите категорию" }}
                        render={({ field, fieldState }) => (
                            <div className={styles.categoryWrapper}>
                                <OfferCategories
                                    locale={locale}
                                    exclusive
                                    value={field.value ? Number(field.value) : undefined}
                                    onChange={(value) => field.onChange(
                                        value ? Number(value) : undefined,
                                    )}
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
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextEditor
                            onChange={field.onChange}
                            value={field.value}
                            onErrorUploadImage={onErrorUploadImage}
                        />
                    )}
                />
                {errors.description && (
                    <p className={styles.error}>{errors.description.message}</p>
                )}
                <div className={styles.field}>
                    <Controller
                        name="author"
                        control={control}
                        render={({ field }) => (
                            <AdminUsersSearchForm value={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>
                <div className={styles.containerButtons}>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit(true))}
                        color="BLUE"
                        variant="FILL"
                        size="SMALL"
                        disabled={isLoading}
                    >
                        {t("volunteer-create-article.Опубликовать")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit(onSubmit(false))}
                        color="BLUE"
                        variant="OUTLINE"
                        size="SMALL"
                        disabled={isLoading}
                    >
                        {t("volunteer-create-article.Сохранить в черновики")}
                    </Button>
                </div>
            </form>
        );
    },
);
