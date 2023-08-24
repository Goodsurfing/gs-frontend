import { memo, useEffect } from "react";

import cn from "classnames";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import type { HostDescriptionFormFields } from "../../model/types/hostDescription";

import { HostDescriptionFormContent } from "../HostDescriptionFormContent/HostDescriptionFormContent";

import styles from "./HostDescriptionForm.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Host, hostApi } from "@/entities/Host";
import {
    hostDescriptionFormAdapter,
    hostDescriptionApiAdapter,
} from "../../lib/hostDescriptionAdapter";
import Button from "@/shared/ui/Button/Button";
import { profileApi } from "@/entities/Profile";

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
    const [createHost, {
        isLoading: isCreateHostLoading,
        error: createHostError,
    }] = hostApi.useCreateHostMutation();

    const [joinToOrganization, {
        isLoading: isJoinLoading,
        error: joinError,
    }] = profileApi.useJoinToHostMutation();

    const [updateHost, {
        isLoading: isHostUpdateLoading,
        error: hostUpdateError,
    }] = hostApi.useUpdateHostMutation();

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async (data) => {
        const preparedData = hostDescriptionApiAdapter(data);
        if (!host) {
            const createHostResponse = await createHost(preparedData).unwrap();
            if (createHostResponse.id) {
                const res = await joinToOrganization(createHostResponse.id);
                console.log(res);
            }
        }
    };

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        reset(hostDescriptionFormAdapter(host));
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
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.form}>
                    <HostDescriptionFormContent />
                </div>
                <div>
                    <Button type="submit" disabled={isCreateHostLoading} color="BLUE" size="MEDIUM" variant="FILL">
                        Сохранить
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
});
