/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useEffect, useState } from "react";
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
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

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

    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async (data) => {
        setToast(undefined);
        const preparedData = hostDescriptionApiAdapter(data);
        if (!host) {
            try {
                const createHostResponse = await createHost(preparedData).unwrap();
                if (createHostResponse.id) {
                    const res = await joinToOrganization(createHostResponse.id);
                }
                setToast({
                    text: "Организация создана",
                    type: HintType.Success,
                });
            } catch (err) {
                setToast({
                    text: "Ошибка при создании организации",
                    type: HintType.Error,
                });
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
        if (host) {
            reset(hostDescriptionFormAdapter(host));
        }
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
            {toast && <HintPopup text={toast.text} type={toast.type} />}
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
