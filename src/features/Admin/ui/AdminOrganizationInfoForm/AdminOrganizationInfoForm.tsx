import React, { FC, useState } from "react";
import {
    DefaultValues, FormProvider, SubmitHandler, useForm,
} from "react-hook-form";
import cn from "classnames";
import { Host } from "@/entities/Host";
import { HostDescriptionFormContent, HostDescriptionFormFields } from "@/features/HostDescription";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./AdminOrganizationInfoForm.module.scss";
import Button from "@/shared/ui/Button/Button";

interface AdminOrganizationInfoFormProps {
    className?: string;
    organization: Host;
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

export const AdminOrganizationInfoForm: FC<AdminOrganizationInfoFormProps> = (props) => {
    const { organization, className } = props;

    const [toast] = useState<ToastAlert>();

    const form = useForm<HostDescriptionFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const {
        handleSubmit,
    } = form;

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = async () => {
        // update host data
    };

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <form
                className={cn(styles.formWrapper, className)}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className={styles.form}>
                    <HostDescriptionFormContent host={organization} />
                </div>
                <div>
                    <Button type="submit" color="BLUE" size="MEDIUM" variant="FILL">
                        Сохранить
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};
