import React, { FC } from "react";
import cn from "classnames";
import {
    FormProvider, useForm, DefaultValues,
    Controller,
    SubmitHandler,
} from "react-hook-form";
import Button from "@/shared/ui/Button/Button";
import { AdminSystemFields } from "@/entities/Admin";
import { AdminUsersSearchForm } from "../AdminUsersSearchForm/ui/AdminUsersSearchForm/AdminUsersSearchForm";
import styles from "./AdminSystemAdminForm.module.scss";

interface AdminSystemAdminFormProps {
    className?: string;
    onSubmit?: (data: AdminSystemFields) => void;
    isLoading: boolean;
}

const defaultValues: DefaultValues<AdminSystemFields> = {
    user: null,
};

export const AdminSystemAdminForm: FC<AdminSystemAdminFormProps> = (props) => {
    const {
        className, onSubmit, isLoading,
    } = props;

    const form = useForm<AdminSystemFields>({
        mode: "onChange",
        defaultValues,
    });
    const {
        handleSubmit, control,
    } = form;

    const onSubmitForm: SubmitHandler<AdminSystemFields> = (data) => {
        onSubmit?.(data);
    };

    return (
        <FormProvider {...form} control={control}>
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <div className={styles.form}>
                    <Controller
                        name="user"
                        control={control}
                        render={({ field }) => (
                            <AdminUsersSearchForm
                                label="Пользователь"
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
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
