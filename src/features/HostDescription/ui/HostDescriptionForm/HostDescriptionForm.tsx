/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    memo, useCallback, useEffect, useState,
} from "react";
import {
    DefaultValues,
    FormProvider, get, SubmitHandler, useForm,
    useWatch,
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
import { usePersistForm } from "@/shared/hooks/usePersistForm ";
import { HOST_DESCRIPTION_FORM } from "@/shared/constants/localstorage";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface HostDescriptionFormProps {
    className?: string;
    host?: string;
    myProfile?: Profile;
    isLoading?: boolean;
    isError?: boolean;
    profileRefetch: () => void;
}

const defaultValues: DefaultValues<HostDescriptionFormFields> = {
    avatar: "",
    address: "",
    mainInfo: {
        aboutInfo: "",
        organization: "",
        shortOrganization: "",
        website: "",
    },
    socialMedia: {
        facebook: "",
        instagram: "",
        telegram: "",
        vk: "",
    },
    type: {
        organizationType: "ИП",
        otherOrganizationType: "",
    },
};

export const HostDescriptionForm = memo((props: HostDescriptionFormProps) => {
    const {
        className, host, myProfile, isLoading = true, isError, profileRefetch,
    } = props;

    const { t } = useTranslation("host");

    const [createHost, {
        isLoading: isCreateHostLoading,
    }] = useCreateHostMutation();

    const [updateHost, {
        isLoading: isHostUpdateLoading,
    }] = useUpdateHostMutation();

    const { data: getHost, refetch: hostRefetch } = useGetMyHostQuery();

    const [toast, setToast] = useState<ToastAlert>();

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const {
        handleSubmit, reset, formState: { isDirty },
        control,
    } = form;

    const watch = useWatch({ control });

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async (data) => {
        setToast(undefined);
        try {
            let preparedData;
            if (!host) {
                preparedData = hostDescriptionApiAdapterCreate(data);
                await createHost(preparedData).unwrap();
                setToast({
                    text: t("hostDescription.Организация создана"),
                    type: HintType.Success,
                });
                profileRefetch();
            } else if (getHost) {
                preparedData = hostDescriptionApiAdapterUpdate(data);
                await updateHost({ id: getHost.id, body: { ...preparedData } }).unwrap();
                setToast({
                    text: t("hostDescription.Данные успешно изменены"),
                    type: HintType.Success,
                });
            }
            sessionStorage.removeItem(HOST_DESCRIPTION_FORM);
        } catch {
            setToast({
                text: t("hostDescription.Произошла ошибка"),
                type: HintType.Error,
            });
        }
    };

    const saveFormData = useCallback(
        (data: HostDescriptionFormFields) => {
            sessionStorage.setItem(
                `${HOST_DESCRIPTION_FORM}`,
                JSON.stringify(data),
            );
        },
        [],
    );

    const loadFormData = useCallback((): Partial<HostDescriptionFormFields> | null => {
        const savedData = sessionStorage.getItem(
            `${HOST_DESCRIPTION_FORM}`,
        );
        if (savedData) {
            return JSON.parse(savedData);
        }
        return null;
    }, []);

    useEffect(() => {
        const savedData = loadFormData();
        if (savedData) {
            reset(savedData);
            return;
        }
        if (getHost && host) {
            reset(hostDescriptionFormAdapter(getHost));
        } else {
            reset();
        }
    }, [getHost, host, loadFormData, myProfile, reset]);

    useEffect(() => {
        if (isDirty) {
            const currentData = watch;
            saveFormData(currentData as HostDescriptionFormFields);
        }
    }, [isDirty, saveFormData, watch]);

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
                <MiniLoader />
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
