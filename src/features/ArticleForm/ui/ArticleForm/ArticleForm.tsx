import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import React, { FC, memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import { OfferCategories } from "@/widgets/OfferCategories";

import Button from "@/shared/ui/Button/Button";
import { InputField } from "@/shared/ui/InputField/InputField";
import { TextEditor } from "@/shared/ui/TextEditor/TextEditor";

import { formSchema } from "../../model/articleForm";
import { UploadArticleCover } from "../UploadArticleCover/UploadArticleCover";
import { useTranslateError } from "../../hooks/useErrorTranslate";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./ArticleForm.module.scss";

interface ArticleFormProps {
    className?: string;
    onComplete: (data: z.infer<typeof formSchema>) => void;
    onErrorUploadImage: (error: string) => void;
}

export const ArticleForm: FC<ArticleFormProps> = memo(
    (props: ArticleFormProps) => {
        const { className, onComplete, onErrorUploadImage } = props;
        const { t } = useTranslation("volunteer");
        const { translate } = useTranslateError();
        const { locale } = useLocale();
        const {
            register,
            formState: { errors },
            control,
            handleSubmit,
        } = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                title: "",
                description: "",
                offerLink: "",
            },
        });

        const onSubmit = handleSubmit(async (data) => {
            onComplete(data);
        });

        return (
            <form className={cn(className, styles.wrapper)} onSubmit={onSubmit}>
                <div>
                    <UploadArticleCover id="upload cover" />
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
                    <InputField
                        name="title"
                        register={register}
                        error={Boolean(errors.title)}
                        helperText={errors.title?.message && translate(errors.title.message)}
                        variant="outlined"
                        placeholder={t(
                            "volunteer-create-article.Заголовок вашей статьи",
                        )}
                        className={styles.input}
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.title}>
                        {t("volunteer-create-article.Категория статьи")}
                    </span>
                    <OfferCategories locale={locale} />
                </div>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextEditor
                            onChange={field.onChange}
                            onErrorUploadImage={onErrorUploadImage}
                            value={field.value}
                        />
                    )}
                />
                {errors.description && (
                    <p className={styles.error}>{translate(errors.description.message)}</p>
                )}
                <div className={styles.field}>
                    <span className={styles.title}>{t("volunteer-create-article.Ссылка на проект гудсёрфинга")}</span>
                    <InputField
                        name="offerLink"
                        register={register}
                        error={Boolean(errors.offerLink)}
                        helperText={errors.offerLink?.message
                            && translate(errors.offerLink?.message)}
                        variant="outlined"
                        placeholder={t("volunteer-create-article.Ваша ссылка на вакансию")}
                        className={styles.input}
                    />
                </div>
                <div className={styles.containerButtons}>
                    <Button type="submit" onClick={onSubmit} color="BLUE" variant="FILL" size="SMALL">
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
