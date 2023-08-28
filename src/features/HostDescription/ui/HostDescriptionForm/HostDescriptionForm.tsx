import { memo, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import cn from "classnames";

import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import {
    Host,
    useUpdateHostMutation,
    useCreateHostMutation,
} from "@/entities/Host";

import { useJoinToHostMutation } from "@/entities/Profile";

import type { HostDescriptionFormFields } from "../../model/types/hostDescription";
import {
    hostDescriptionFormAdapter,
    hostDescriptionApiAdapter,
} from "../../lib/hostDescriptionAdapter";
import { HostDescriptionFormContent } from "../HostDescriptionFormContent/HostDescriptionFormContent";

import styles from "./HostDescriptionForm.module.scss";

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
    }] = useCreateHostMutation();

    const [joinToOrganization, {
        isLoading: isJoinLoading,
        error: joinError,
    }] = useJoinToHostMutation();

    const [updateHost, {
        isLoading: isHostUpdateLoading,
        error: hostUpdateError,
    }] = useUpdateHostMutation();

    console.log(host);

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async (data) => {
        const preparedData = hostDescriptionApiAdapter(data);
        if (!host) {
            const createHostResponse = await createHost(preparedData).unwrap();
            if (createHostResponse.id) {
                const res = await joinToOrganization(createHostResponse.id);
                console.log(res);
            }
        }
        if (host) {
            updateHost({ body: { ...preparedData, id: host.id } });
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
