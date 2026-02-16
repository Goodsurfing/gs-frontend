import cn from "classnames";
import React, { FC, memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { OfferCategories } from "@/widgets/OfferCategories";

import Button from "@/shared/ui/Button/Button";
import { InputField } from "@/shared/ui/InputField/InputField";
import { TextEditor } from "@/shared/ui/TextEditor/TextEditor";
import { UploadArticleCover } from "../UploadArticleCover/UploadArticleCover";
import { useTranslateError } from "../../hooks/useErrorTranslate";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Image } from "@/types/media";
import styles from "./ArticleForm.module.scss";

interface ArticleFormProps {
    className?: string;
    initialData?: ArticleFormFields;
}

export interface ArticleFormFields {
    image: Image;
    name: string;
    categoryId: string;
    description: string;
    projectUrl: string;
}

export const ArticleForm: FC<ArticleFormProps> = memo(
    (props: ArticleFormProps) => {
        const { className, initialData } = props;
        const { t } = useTranslation("volunteer");
        const { translate } = useTranslateError();
        const { locale } = useLocale();
        const {
            register,
            formState: { errors },
            control,
            reset,
        } = useForm<ArticleFormFields>({
            mode: "onChange",
        });

        useEffect(() => {
            if (initialData) {
                reset(initialData);
            } else {
                reset();
            }
        }, [initialData, reset]);

        return (
            <form className={cn(className, styles.wrapper)}>
                <div>
                    <UploadArticleCover id="upload cover" onUpload={} />
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
                                helperText={fieldState.error?.message
                                    && translate(fieldState.error?.message)}
                                variant="outlined"
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
                                    onChange={(value) => field.onChange(String(value))}
                                />
                                {fieldState.error && (
                                    <span className={styles.errorText}>
                                        {translate(fieldState.error.message)}
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
                        />
                    )}
                />
                {errors.description && (
                    <p className={styles.error}>{translate(errors.description.message)}</p>
                )}
                <div className={styles.field}>
                    <span className={styles.title}>{t("volunteer-create-article.Ссылка на проект гудсёрфинга")}</span>
                    <Controller
                        name="projectUrl"
                        control={control}
                        render={({ fieldState }) => (
                            <InputField
                                name="projectUrl"
                                register={register}
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message
                            && translate(fieldState.error?.message)}
                                variant="outlined"
                                placeholder={t("volunteer-create-article.Ваша ссылка на вакансию")}
                                className={styles.input}
                            />
                        )}
                    />
                </div>
                <div className={styles.containerButtons}>
                    <Button type="submit" color="BLUE" variant="FILL" size="SMALL">
                        {t("volunteer-create-article.Опубликовать")}
                    </Button>
                    <Button color="BLUE" variant="OUTLINE" size="SMALL">
                        {t("volunteer-create-article.Сохранить в черновики")}
                    </Button>
                </div>
            </form>
        );
    },
);
