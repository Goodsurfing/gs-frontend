import React, { FC, useEffect } from "react";
import {
    useForm, SubmitHandler, FormProvider, Controller,
} from "react-hook-form";
import { Modal } from "@/shared/ui/Modal/Modal";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import Button from "@/shared/ui/Button/Button";
import { AdminDonationReportFileFields } from "@/entities/Admin";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import styles from "./AdminDonationReportFileModal.module.scss";

export type { AdminDonationReportFileFields } from "@/entities/Admin";

interface AdminDonationReportFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: AdminDonationReportFileFields) => Promise<void> | void;
    initialData?: AdminDonationReportFileFields | null;
    isLoading?: boolean;
}

export const AdminDonationReportFileModal: FC<AdminDonationReportFileModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    isLoading = false,
}) => {
    type FormValues = {
        name: string;
        file: AdminDonationReportFileFields["file"] | null;
    };

    const form = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            name: "",
            file: null,
        } as any,
    });

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = form;

    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData as FormValues);
        } else if (isOpen) {
            reset({ name: "", file: null } as FormValues);
        }
    }, [isOpen, initialData, reset]);

    const onSubmitForm: SubmitHandler<FormValues> = async (data) => {
        // cast is safe because validation guarantees non-null file
        await onSubmit(data as AdminDonationReportFileFields);
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} isShowCloseIcon>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>
                    {initialData ? "Редактировать файл" : "Добавить файл"}
                </h2>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className={styles.form}>
                            <InputControl
                                label="Название"
                                rules={{ required: "Название обязательно" }}
                                control={control}
                                name="name"
                                placeholder="Введите имя файла"
                                isError={!!errors.name}
                            />
                            {errors.name && (
                                <ErrorText text={errors.name.message} className={styles.error} />
                            )}

                            <div className={styles.field}>
                                <div className={styles.label}>Файл</div>
                                <Controller
                                    name="file"
                                    control={control}
                                    rules={{ required: !initialData ? "Файл обязателен" : false }}
                                    render={({ field: { onChange, value } }) => (
                                        <ImageDropzone
                                            value={value?.contentUrl}
                                            onChange={async (file) => {
                                                if (file) {
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
                                                }
                                            }}
                                            error={!!errors.file}
                                            accept={{
                                                "image/jpeg": [".jpeg", ".jpg"],
                                                "image/png": [".png"],
                                                "application/pdf": [".pdf"],
                                            }}
                                        />
                                    )}
                                />
                                {errors.file && (
                                    <ErrorText
                                        text={errors.file.message}
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
                                className={styles.cancelButton}
                                onClick={onClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="FILL"
                                color="BLUE"
                                size="MEDIUM"
                                className={styles.submitButton}
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
