import React, { FC, useEffect } from "react";
import {
    Controller,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { AboutProjectInfoFields } from "@/entities/Admin";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import Button from "@/shared/ui/Button/Button";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { Modal } from "@/shared/ui/Modal/Modal";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import styles from "./AdminAboutProjectPrincipleModal.module.scss";

type AboutProjectPrinciple = AboutProjectInfoFields["principles"][number];

interface AdminAboutProjectPrincipleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AboutProjectPrinciple) => void;
    initialData?: AboutProjectPrinciple | null;
    isLoading?: boolean;
}

interface PrincipleFormValues {
    name: string;
    description: string;
    image: AboutProjectPrinciple["image"] | null;
}

export const AdminAboutProjectPrincipleModal: FC<AdminAboutProjectPrincipleModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isLoading = false,
}) => {
    const form = useForm<PrincipleFormValues>({
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            image: null,
        },
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = form;

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                name: initialData.name,
                description: initialData.description,
                image: initialData.image,
            });
            return;
        }

        if (isOpen) {
            reset({
                name: "",
                description: "",
                image: null,
            });
        }
    }, [isOpen, initialData, reset]);

    const handleSubmitForm: SubmitHandler<PrincipleFormValues> = (data) => {
        if (!data.image) {
            return;
        }

        onSubmit({
            name: data.name,
            description: data.description,
            image: data.image,
        });
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {initialData ? "Редактировать принцип" : "Добавить принцип"}
                </h2>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <div className={styles.form}>
                            <InputControl
                                label="Название"
                                control={control}
                                name="name"
                                rules={{ required: "Название обязательно" }}
                                placeholder="Введите название принципа"
                                isError={!!errors.name?.message}
                            />
                            {errors.name?.message && (
                                <ErrorText text={errors.name.message} className={styles.error} />
                            )}
                            <TextAreaControl
                                label="Описание"
                                control={control}
                                name="description"
                                rules={{ required: "Описание обязательно" }}
                                placeholder="Введите описание принципа"
                                isError={!!errors.description?.message}
                            />
                            {errors.description?.message && (
                                <ErrorText
                                    text={errors.description.message}
                                    className={styles.error}
                                />
                            )}

                            <div className={styles.field}>
                                <span className={styles.label}>Изображение</span>
                                <Controller
                                    name="image"
                                    control={control}
                                    rules={{ required: "Изображение обязательно" }}
                                    render={({ field: { onChange, value } }) => (
                                        <ImageDropzone
                                            value={value?.contentUrl}
                                            onChange={async (file) => {
                                                if (!file) {
                                                    onChange(null);
                                                    return;
                                                }

                                                try {
                                                    const result = await uploadFile(
                                                        file.name,
                                                        file,
                                                    );

                                                    if (result) {
                                                        onChange({
                                                            id: result.id,
                                                            contentUrl: result.contentUrl,
                                                            thumbnails: result.thumbnails,
                                                        });
                                                    }
                                                } catch {
                                                    onChange(null);
                                                }
                                            }}
                                            error={!!errors.image}
                                            accept={{
                                                "image/jpeg": [".jpeg", ".jpg"],
                                                "image/png": [".png"],
                                            }}
                                        />
                                    )}
                                />
                                {errors.image?.message && (
                                    <ErrorText
                                        text={errors.image.message}
                                        className={styles.error}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="OUTLINE"
                                color="GRAY"
                                size="MEDIUM"
                                onClick={onClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="FILL"
                                color="BLUE"
                                size="MEDIUM"
                                disabled={isLoading || isSubmitting}
                            >
                                {isLoading ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
};
