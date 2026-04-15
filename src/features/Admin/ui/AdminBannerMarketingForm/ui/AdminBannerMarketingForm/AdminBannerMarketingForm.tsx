import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    Controller,
    DefaultValues,
    FormProvider,
    useForm,
} from "react-hook-form";
import { AdminBannerMarketingFileds, BannerMarketingType } from "@/entities/Admin";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { SelectType } from "../SelectType/SelectType";
import styles from "./AdminBannerMarketingForm.module.scss";

interface AdminBannerMarketingFormProps {
    className?: string;
    initialData?: AdminBannerMarketingFileds;
    onSubmit?: (data: AdminBannerMarketingFileds) => void;
    isLoading: boolean;
}

type BannerMarketingFormField = "description" | "url" | "image";

interface BannerMarketingTypeConfig {
    fields: BannerMarketingFormField[];
    canSave: boolean;
}

const bannerMarketingTypeConfig: Record<BannerMarketingType, BannerMarketingTypeConfig> = {
    [BannerMarketingType.UNDER_HEADER_ALL_PAGES]: {
        fields: ["description", "url"],
        canSave: true,
    },
    [BannerMarketingType.VACANCY_PAGE]: {
        fields: ["description", "url", "image"],
        canSave: true,
    },
    [BannerMarketingType.MAIN_PAGE]: {
        fields: ["description", "url", "image"],
        canSave: true,
    },
};

const requiredErrorMessage = "Это поле является обязательным";

const defaultValues: DefaultValues<AdminBannerMarketingFileds> = {
    image: undefined,
    isActive: false,
    type: null,
};

export const AdminBannerMarketingForm: FC<AdminBannerMarketingFormProps> = (props) => {
    const {
        className,
        initialData,
        onSubmit,
        isLoading,
    } = props;

    const form = useForm<AdminBannerMarketingFileds>({
        mode: "onChange",
        defaultValues,
        shouldUnregister: true,
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = form;

    const selectedType = watch("type");
    const selectedTypeConfig = selectedType ? bannerMarketingTypeConfig[selectedType] : null;
    const visibleFields = selectedTypeConfig?.fields ?? [];
    const shouldShowButtons = Boolean(selectedTypeConfig?.canSave);

    const isFieldVisible = (field: BannerMarketingFormField) => visibleFields.includes(field);

    const onSubmitForm = (isActiveValue: boolean) => (data: AdminBannerMarketingFileds) => {
        onSubmit?.({
            ...data,
            isActive: isActiveValue,
        });
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            return;
        }

        reset();
    }, [initialData, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form className={cn(styles.formWrapper, className)}>
                <div className={styles.form}>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: requiredErrorMessage }}
                        render={({ field: { value, onChange } }) => (
                            <SelectType value={value} onChange={onChange} />
                        )}
                    />

                    {isFieldVisible("description") && (
                        <>
                            <TextAreaControl
                                label="Текст"
                                rules={{ required: requiredErrorMessage }}
                                control={control}
                                name="description"
                                isError={!!errors.description?.message}
                            />
                            {errors.description?.message && (
                                <ErrorText
                                    text={errors.description.message}
                                    className={styles.error}
                                />
                            )}
                        </>
                    )}

                    {isFieldVisible("url") && (
                        <>
                            <InputControl
                                label="Ссылка"
                                rules={{ required: requiredErrorMessage }}
                                control={control}
                                name="url"
                                isError={!!errors.url?.message}
                            />
                            {errors.url?.message && (
                                <ErrorText text={errors.url.message} className={styles.error} />
                            )}
                        </>
                    )}

                    {isFieldVisible("image") && (
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
                                        onChange={async (file) => {
                                            if (!file) {
                                                onChange(undefined);
                                                return;
                                            }

                                            try {
                                                const result = await uploadFile(file.name, file);
                                                if (result) {
                                                    onChange({
                                                        id: result.id,
                                                        contentUrl: result.contentUrl,
                                                        thumbnails: result.thumbnails,
                                                    });
                                                }
                                            } catch {
                                                onChange(undefined);
                                            }
                                        }}
                                        error={!!errors.image}
                                    />
                                )}
                            />
                            {errors.image?.message && (
                                <ErrorText text={errors.image.message} className={styles.error} />
                            )}
                        </div>
                    )}
                </div>

                {shouldShowButtons && (
                    <div className={styles.containerButtons}>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmitForm(true))}
                            color="BLUE"
                            variant="FILL"
                            size="SMALL"
                            disabled={isLoading}
                        >
                            Сохранить и опубликовать
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit(onSubmitForm(false))}
                            color="BLUE"
                            variant="OUTLINE"
                            size="SMALL"
                            disabled={isLoading}
                        >
                            Сохранить в черновики
                        </Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
};
