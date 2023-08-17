import { memo, useEffect } from "react";

import cn from "classnames";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import type { HostDescriptionFormFields } from "../../model/types/hostDescription";

import { HostDescriptionFormContent } from "../HostDescriptionFormContent/HostDescriptionFormContent";

import styles from "./HostDescriptionForm.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Host } from "@/entities/Host";
import { hostDescriptionAdapter } from "../../lib/hostDescriptionAdapter";

interface HostDescriptionFormProps {
    className?: string;
    host?: Host;
    isLoading?: boolean;
    error?: string;
}

export const HostDescriptionForm = memo((props: HostDescriptionFormProps) => {
    const {
        className, host, error, isLoading = true,
    } = props;

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = (data) => {};

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        reset(hostDescriptionAdapter(host));
    }, [host, reset]);

    if (isLoading) {
        return (
            <div className={cn(styles.form, className)}>
                <Preloader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn(styles.form, className)}>
                Произошла ошибка! Поробуйте перезагрузить страницу
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <form
                className={cn(styles.form, className)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <HostDescriptionFormContent />
            </form>
        </FormProvider>
    );
});
