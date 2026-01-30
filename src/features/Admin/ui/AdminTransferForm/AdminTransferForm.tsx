import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import { GetTransfer, Transfer } from "@/shared/data/conditions";
import styles from "./AdminTransferForm.module.scss";

interface AdminTransferFormProps {
    className?: string;
    transfer?: GetTransfer;
    onSubmit?: (data: AdminTransferFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<Transfer> = {
    imagePath: undefined,
    name: "",
};

export type AdminTransferFields = Omit<Transfer, "id" | "imagePath"> & {
    imagePath?: File | string;
    nameEn: string;
    nameEs: string;
};

export const AdminTransferForm: FC<AdminTransferFormProps> = (props) => {
    const {
        className, transfer, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminTransferFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<AdminTransferFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (transfer) {
            reset({
                name: transfer.name || "",
                nameEn: transfer.nameEn || "",
                nameEs: transfer.nameEs || "",
                imagePath: transfer.imagePath || undefined,
            });
        } else {
            reset();
        }
    }, [transfer, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Название оплачиваемого отпуска (ru)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="name"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.name?.message}
                    />
                    {errors?.name?.message && (
                        <ErrorText
                            text={errors.name.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Название оплачиваемого отпуска (en)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEn"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.nameEn?.message}
                    />
                    {errors?.nameEn?.message && (
                        <ErrorText
                            text={errors.nameEn.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Название оплачиваемого отпуска (es)"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="nameEs"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.nameEs?.message}
                    />
                    {errors?.nameEs?.message && (
                        <ErrorText
                            text={errors.nameEs.message}
                            className={styles.error}
                        />
                    )}
                    <div className={styles.field}>
                        <label className={styles.label}>Изображение</label>
                        <Controller
                            name="imagePath"
                            rules={{
                                required: "Изображение обязательно",
                            }}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ImageDropzone
                                    value={value}
                                    onChange={onChange}
                                    error={!!errors.imagePath}
                                    accept={{
                                        "image/svg+xml": [".svg"],
                                    }}
                                />
                            )}
                        />
                        {errors.imagePath?.message && (
                            <ErrorText text={errors.imagePath.message} className={styles.error} />
                        )}
                        <p>Загружать только SVG формат</p>
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
    );
};
