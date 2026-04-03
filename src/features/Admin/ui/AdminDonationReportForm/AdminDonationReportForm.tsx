import React, { FC, useEffect, useState } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    SubmitHandler,
} from "react-hook-form";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import Button from "@/shared/ui/Button/Button";
import { AdminDonationReportFields, AdminDonationReportFileFields } from "@/entities/Admin";
import CustomLink from "@/shared/ui/Link/Link";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { AdminDonationReportFileModal } from "../AdminDonationReportFileModal/AdminDonationReportFileModal";
import styles from "./AdminDonationReportForm.module.scss";

export type { AdminDonationReportFields } from "@/entities/Admin";

interface AdminDonationReportFormProps {
    className?: string;
    initialData?: AdminDonationReportFields;
    onSubmit?: (data: AdminDonationReportFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminDonationReportFields> = {
    name: "",
    files: [],
};

export const AdminDonationReportForm: FC<AdminDonationReportFormProps> = (props) => {
    const {
        className, initialData, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminDonationReportFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
        clearErrors, setValue,
        watch,
    } = form;

    const files = watch("files") || [];

    const onSubmitForm: SubmitHandler<AdminDonationReportFields> = (data) => {
        if (!data.files?.length) {
            form.setError("files", { message: "Добавьте хотя бы один файл" });
            return;
        }
        onSubmit?.(data);
    };

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                files: initialData.files,
            });
        } else {
            reset();
        }
    }, [reset, initialData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddFile = (file: AdminDonationReportFileFields) => {
        const updatedFiles = [...files, file];
        setValue("files", updatedFiles, { shouldValidate: true, shouldDirty: true });
        clearErrors("files");
        setIsModalOpen(false);
    };

    const handleDeleteFile = (fileId: string) => {
        if (window.confirm("Вы уверены, что хотите удалить файл?")) {
            const updatedFiles = files.filter((file) => file.file.id !== fileId);
            setValue("files", updatedFiles, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <>
            <FormProvider {...form} control={control}>
                <form
                    className={cn(styles.formWrapper, className)}
                    onSubmit={handleSubmit(onSubmitForm)}
                >
                    <div className={styles.form}>
                        <InputControl
                            label="Заголовок отчёта"
                            rules={{ required: "Это поле является обязательным" }}
                            control={control}
                            name="name"
                            minLength={3}
                            isError={!!errors.name?.message}
                        />
                        {errors?.name?.message && (
                            <ErrorText
                                text={errors.name.message}
                                className={styles.error}
                            />
                        )}
                        <div className={styles.filesSection}>
                            <div className={styles.filesHeader}>
                                <span className={styles.label}>Файлы</span>
                                <Button
                                    color="GREEN"
                                    size="SMALL"
                                    variant="OUTLINE"
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Добавить файл
                                </Button>
                            </div>
                            {errors.files?.message && (
                                <ErrorText text={errors.files.message} className={styles.error} />
                            )}
                            {files.length === 0 && (
                                <p className={styles.emptyList}>Файлы не добавлены</p>
                            )}
                            {files.map((field, index) => (
                                <div className={styles.fileItemWrapper}>
                                    {" "}
                                    {/* Общий контейнер */}
                                    <CustomLink
                                        to={getMediaContent(field.file.contentUrl) ?? ""}
                                        variant="DEFAULT"
                                        key={index}
                                        className={styles.fileItem}
                                        target="_blank"
                                    >
                                        <span className={styles.fileName}>{field.name}</span>
                                    </CustomLink>

                                    <Button
                                        color="RED"
                                        size="SMALL"
                                        variant="FILL"
                                        type="button"
                                        onClick={() => handleDeleteFile(field.file.id)}
                                        className={styles.deleteButton}
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        disabled={isLoading}
                    >
                        {isLoading ? "Идёт сохранение" : "Сохранить"}
                    </Button>
                </form>
            </FormProvider>

            <AdminDonationReportFileModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleAddFile}
            />
        </>
    );
};
