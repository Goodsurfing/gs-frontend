/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useEffect, useState } from "react";
import {
    FormProvider, get, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import {
    Host,
    useUpdateHostMutation,
    useCreateHostMutation,
} from "@/entities/Host";

import type { HostDescriptionFormFields } from "../../model/types/hostDescription";
import {
    hostDescriptionFormAdapter,
    hostDescriptionApiAdapterCreate,
    hostDescriptionApiAdapterUpdate,
} from "../../lib/hostDescriptionAdapter";
import { HostDescriptionFormContent } from "../HostDescriptionFormContent/HostDescriptionFormContent";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

import styles from "./HostDescriptionForm.module.scss";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import { Profile, useGetProfileInfoQuery } from "@/entities/Profile";

interface HostDescriptionFormProps {
    className?: string;
    host?: string;
    myProfile?: Profile;
    isLoading?: boolean;
    isError?: boolean;
    profileRefetch: () => void;
}

export const HostDescriptionForm = memo((props: HostDescriptionFormProps) => {
    const {
        className, host, myProfile, isLoading = true, isError, profileRefetch,
    } = props;

    const { t, ready } = useTranslation("host");

    const [createHost, {
        isLoading: isCreateHostLoading,
        error: createHostError,
    }] = useCreateHostMutation();

    const [updateHost, {
        isLoading: isHostUpdateLoading,
        error: hostUpdateError,
    }] = useUpdateHostMutation();

    const { data: getHost, refetch: hostRefetch } = useGetMyHostQuery();

    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async (data) => {
        setToast(undefined);
        let preparedData;
        if (!host) {
            try {
                preparedData = hostDescriptionApiAdapterCreate(data);
                await createHost(preparedData).unwrap();
                setToast({
                    text: t("hostDescription.Организация создана"),
                    type: HintType.Success,
                });
                profileRefetch();
            } catch {
                setToast({
                    text: t("hostDescription.Ошибка при создании организации"),
                    type: HintType.Error,
                });
            }
        }
        if (host && getHost) {
            try {
                preparedData = hostDescriptionApiAdapterUpdate(data);
                await updateHost({ id: getHost.id, body: { ...preparedData } }).unwrap();
                setToast({
                    text: t("hostDescription.Данные успешно изменены"),
                    type: HintType.Success,
                });
            } catch {
                setToast({
                    text: t("hostDescription.Произошла ошибка"),
                    type: HintType.Error,
                });
            }
        }
    };

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
    });

    const { handleSubmit, reset } = form;

    useEffect(() => {
        if (getHost && host) {
            reset(hostDescriptionFormAdapter(getHost));
        } else {
            reset();
        }
    }, [getHost, host, myProfile, reset]);

    useEffect(() => {
        if (myProfile) {
            hostRefetch();
        } else {
            reset();
        }
    }, [hostRefetch, myProfile, reset]);

    if (isLoading) {
        return (
            <div className={cn(styles.form, className)}>
                <Preloader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cn(styles.form, className)}>
                {t("hostDescription.Произошла ошибка! Поробуйте перезагрузить страницу")}
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
                    <HostDescriptionFormContent host={getHost} />
                </div>
                <div>
                    <Button type="submit" disabled={isCreateHostLoading || isHostUpdateLoading} color="BLUE" size="MEDIUM" variant="FILL">
                        {t("hostDescription.Сохранить")}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
});
