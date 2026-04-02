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
import { AdminAmbassadorsFields } from "@/entities/Admin";
import { TextAreaControl } from "@/shared/ui/TextAreaControl/TextAreaControl";
import styles from "./AdminAmbassadorForm.module.scss";

interface AdminAmbassadorFormProps {
    className?: string;
    initialData?: AdminAmbassadorsFields;
    onSubmit?: (data: AdminAmbassadorsFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminAmbassadorsFields> = {
    image: undefined,
};

export const AdminAmbassadorForm: FC<AdminAmbassadorFormProps> = (props) => {
    const {
        className, initialData, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminAmbassadorsFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, reset, control, formState: { errors },
    } = form;

    const onSubmitForm: SubmitHandler<AdminAmbassadorsFields> = (data) => {
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
                        minLength={3}
                        maxLength={60}
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
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.lastName?.message}
                    />
                    {errors?.lastName?.message && (
                        <ErrorText
                            text={errors.lastName.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Город"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="city"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.city?.message}
                    />
                    {errors?.city?.message && (
                        <ErrorText
                            text={errors.city.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Страна"
                        rules={{ required: "Это поле является обязательным" }}
                        control={control}
                        name="country"
                        minLength={3}
                        maxLength={60}
                        isError={!!errors.country?.message}
                    />
                    {errors?.country?.message && (
                        <ErrorText
                            text={errors.country.message}
                            className={styles.error}
                        />
                    )}
                    <TextAreaControl
                        label="Описание"
                        control={control}
                        name="description"
                        minLength={3}
                        maxLength={200}
                        isError={!!errors.description?.message}
                    />
                    {errors?.description?.message && (
                        <ErrorText
                            text={errors.description.message}
                            className={styles.error}
                        />
                    )}
                    <InputControl
                        label="Сортировка курса"
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
                                    value={value.contentUrl}
                                    onChange={onChange}
                                    error={!!errors.image}
                                />
                            )}
                        />
                        {errors.image?.message && (
                            <ErrorText text={errors.image.message} className={styles.error} />
                        )}
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
