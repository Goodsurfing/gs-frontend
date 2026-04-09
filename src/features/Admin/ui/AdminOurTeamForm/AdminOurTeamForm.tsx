import React, { FC, useEffect } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import { FormControlLabel, Typography } from "@mui/material";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { InputControl } from "@/shared/ui/InputControl/InputControl";
import { ImageDropzone } from "@/shared/ui/ImageDropzone/ImageDropzone";
import Button from "@/shared/ui/Button/Button";
import { OurTeamFields } from "@/entities/Admin";
import styles from "./AdminOurTeamForm.module.scss";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import SwitchComponent from "@/shared/ui/Switch/Switch";

interface AdminOurTeamFormProps {
    className?: string;
    initialData?: OurTeamFields;
    onSubmit?: (data: OurTeamFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<OurTeamFields> = {
    image: undefined,
    isFounder: false,
};

export const AdminOurTeamForm: FC<AdminOurTeamFormProps> = (props) => {
    const {
        className, initialData, onSubmit, isLoading,
    } = props;

    const form = useForm<OurTeamFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<OurTeamFields> = (data) => {
        onSubmit?.(data);
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset();
        }
    }, [initialData, reset]);

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <InputControl
                        label="Имя"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="firstName"
                        isError={!!errors.firstName?.message}
                    />
                    {errors?.firstName?.message && (
                        <ErrorText
                            text={errors.firstName.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Фамилия"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="lastName"
                        isError={!!errors.lastName?.message}
                    />
                    {errors?.lastName?.message && (
                        <ErrorText
                            text={errors.lastName.message}
                            className={styles.error}
                        />
                    )}
                    <Controller
                        name="isFounder"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                                label={(
                                    <Typography
                                        sx={{
                                            fontFamily: "Lato",
                                            fontWeight: "400",
                                            fontSize: "16px",
                                            color: "#212121",
                                        }}
                                    >
                                        Основатель
                                    </Typography>
                                )}
                                control={(
                                    <SwitchComponent
                                        checked={Boolean(value)}
                                        onChange={(_, checked) => onChange(checked)}
                                    />
                                )}
                            />
                        )}
                    />
                    <InputControl
                        label="Позиция"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="position"
                        isError={!!errors.position?.message}
                    />
                    {errors?.position?.message && (
                        <ErrorText
                            text={errors.position.message}
                            className={styles.error}
                        />
                    )}
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
                    <InputControl
                        label="Сортировка"
                        type="number"
                        control={control}
                        name="sort"
                        placeholder="Введите сортировку"
                        isError={!!errors.sort}
                    />
                    {errors.sort && (
                        <ErrorText
                            text={errors.sort.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Вконтакте"
                        control={control}
                        name="vkontakte"
                        isError={!!errors.vkontakte?.message}
                    />
                    {errors?.vkontakte?.message && (
                        <ErrorText
                            text={errors.vkontakte.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Телеграм"
                        control={control}
                        name="telegram"
                        isError={!!errors.telegram?.message}
                    />
                    {errors?.telegram?.message && (
                        <ErrorText
                            text={errors.telegram.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Id пользователя"
                        control={control}
                        name="userId"
                        isError={!!errors.userId?.message}
                    />
                    {errors?.userId?.message && (
                        <ErrorText
                            text={errors.userId.message}
                            className={styles.error}
                        />
                    )}
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
