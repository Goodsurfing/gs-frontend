import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import React, { FC, memo } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import Button from "@/shared/ui/Button/Button";
import { TextEditor } from "@/shared/ui/TextEditor/TextEditor";

import { formSchema } from "../../model/articleForm";
import { UploadArticleCover } from "../UploadArticleCover/UploadArticleCover";
import { OfferCategories } from "@/widgets/OfferCategories";
import { InputField } from "@/shared/ui/InputField/InputField";
import styles from "./ArticleForm.module.scss";

interface ArticleFormProps {
    className?: string;
}

export const ArticleForm: FC<ArticleFormProps> = memo(
    (props: ArticleFormProps) => {
        const { className } = props;
        const {
            register,
            formState: { errors },
            control,
        } = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                title: "",
                description: "",
                offerLink: "",
            },
        });

        return (
            <form
                className={cn(className, styles.wrapper)}
            >
                <div>
                    <UploadArticleCover id="upload cover" />
                    <span className={styles.smallDescription}>
                        Оптимальные размеры 2175 х 966. Вес не более 5МБ
                    </span>
                </div>
                <span className={styles.title}>Название статьи</span>
                <InputField
                    name="title"
                    register={register}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    variant="outlined"
                    placeholder="Заголовок вашей статьи"
                    className={styles.input}
                />
                <OfferCategories />
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
                {errors.description && <p className={styles.error}>{errors.description.message}</p>}
                <span className={styles.title}>Ссылка на проект</span>
                <InputField
                    name="offerLink"
                    register={register}
                    error={Boolean(errors.offerLink)}
                    helperText={errors.offerLink?.message}
                    variant="outlined"
                    placeholder="Ваша ссылка на заявку"
                    className={styles.input}
                />
                <div className={styles.containerButtons}>
                    <Button color="BLUE" variant="FILL" size="SMALL">
                        Опубликовать
                    </Button>
                    <Button color="BLUE" variant="OUTLINE" size="SMALL">
                        Сохранить в черновики
                    </Button>
                </div>
            </form>
        );
    },
);
