import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Controller, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import { Modal } from "@/shared/ui/Modal/Modal";
import { VideoFields } from "@/entities/Video";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { UploadArticleCover } from "@/features/ArticleForm/ui/UploadArticleCover/UploadArticleCover";
import { OfferCategories } from "@/widgets/OfferCategories";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import Button from "@/shared/ui/Button/Button";
import styles from "./VideoModalForm.module.scss";

interface VideoModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: VideoFields) => void;
    initialData?: VideoFields | null;
    isLoading?: boolean;
    locale: Locale;
}

export const VideoModalForm: FC<VideoModalFormProps> = (props) => {
    const {
        isOpen, onClose, onSubmit, initialData, isLoading,
        locale,
    } = props;
    const { t } = useTranslation("video");
    const form = useForm<VideoFields>({
        mode: "onChange",
        defaultValues: {
            image: null,
        },
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = form;

    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData);
        } else if (isOpen) {
            reset();
        }
    }, [isOpen, initialData, reset]);

    const onSubmitForm: SubmitHandler<VideoFields> = (data) => {
        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {t("Добавить видео")}
                </h2>
                <FormProvider {...form}>
                    <form className={styles.form}>
                        <InputControl
                            label={t("Название видео")}
                            rules={{
                                required: t("Название обязательно"),
                                minLength: { value: 2, message: t("Минимум 2 символа") },
                                maxLength: { value: 100, message: t("Максимум 100 символов") },
                            }}
                            control={control}
                            name="name"
                            placeholder={t("Введите название видео")}
                            isError={!!errors.name}
                        />
                        {errors.name && (
                            <ErrorText
                                text={errors.name.message}
                                className={styles.error}
                            />
                        )}
                        <InputControl
                            label={t("Описание видео")}
                            rules={{
                                required: t("Описание обязательно"),
                                minLength: { value: 2, message: t("Минимум 2 символа") },
                                maxLength: { value: 100, message: t("Максимум 100 символов") },
                            }}
                            control={control}
                            name="description"
                            placeholder={t("Введите описание видео")}
                            isError={!!errors.description}
                        />
                        {errors.description && (
                            <ErrorText
                                text={errors.description.message}
                                className={styles.error}
                            />
                        )}
                        <InputControl
                            label={t("Ссылка на видео")}
                            rules={{
                                required: t("Ссылка обязательна"),
                            }}
                            control={control}
                            name="url"
                            placeholder={t("Введите ссылку на видео")}
                            isError={!!errors.url}
                        />
                        {errors.url && (
                            <ErrorText
                                text={errors.url.message}
                                className={styles.error}
                            />
                        )}
                        <Controller
                            name="image"
                            control={control}
                            rules={{
                                required: t("Загрузите обложку"),
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
                        <div className={styles.field}>
                            <span className={styles.title}>
                                {t("Категория видео")}
                            </span>
                            <Controller
                                name="categoryId"
                                control={control}
                                rules={{ required: t("Выберите категорию") }}
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
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmitForm)}
                            color="BLUE"
                            variant="FILL"
                            size="SMALL"
                            disabled={isLoading}
                        >
                            {t("Опубликовать")}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
};
