import React, { FC, useEffect } from "react";
import {
    useForm, SubmitHandler, FormProvider, Controller,
} from "react-hook-form";
import { Modal } from "@/shared/ui/Modal/Modal";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Button from "@/shared/ui/Button/Button";
import { AdminExpertFields } from "@/entities/Admin";
import styles from "./AdminExpertFormModal.module.scss";

interface AdminExpertFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdminExpertFields) => void;
    initialData?: AdminExpertFields | null;
    isLoading?: boolean;
}

export const AdminExpertFormModal: FC<AdminExpertFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isLoading = false,
}) => {
    const form = useForm<AdminExpertFields>({
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
        formState: { errors },
    } = form;

    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData);
        } else if (isOpen) {
            reset({ name: "", description: "", image: null });
        }
    }, [isOpen, initialData, reset]);

    const onSubmitForm: SubmitHandler<AdminExpertFields> = (data) => {
        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {initialData ? "Редактировать эксперта" : "Добавить эксперта"}
                </h2>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className={styles.form}>
                            <InputControl
                                label="Имя эксперта"
                                rules={{
                                    required: "Имя обязательно",
                                    minLength: { value: 2, message: "Минимум 2 символа" },
                                    maxLength: { value: 100, message: "Максимум 100 символов" },
                                }}
                                control={control}
                                name="name"
                                placeholder="Введите имя эксперта"
                                isError={!!errors.name}
                            />
                            {errors.name && (
                                <ErrorText text={errors.name.message} className={styles.error} />
                            )}

                            <TextAreaControl
                                control={control}
                                name="description"
                                label="Описание эксперта"
                                placeholder="Расскажите о достижениях и опыте эксперта"
                                maxLength={500}
                                description="Не более 50 знаков"
                                rules={{
                                    maxLength: { value: 50, message: "Превышено ограничение в 50 символов" },
                                }}
                            />
                            {errors.description && (
                                <ErrorText
                                    text={errors.description.message}
                                    className={styles.error}
                                />
                            )}

                            <div className={styles.field}>
                                <label className={styles.label}>Фотография эксперта</label>
                                <Controller
                                    name="image"
                                    rules={{ required: "Фотография обязательна" }}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <ImageDropzone
                                            value={value}
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
                                color="GRAY"
                                size="MEDIUM"
                                variant="OUTLINE"
                                onClick={onClose}
                                disabled={isLoading}
                                className={styles.cancelButton}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                color="GREEN"
                                size="MEDIUM"
                                variant="FILL"
                                disabled={isLoading}
                                className={styles.submitButton}
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
