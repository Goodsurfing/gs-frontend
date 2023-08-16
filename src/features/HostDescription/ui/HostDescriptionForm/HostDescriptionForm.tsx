import { memo } from "react";

import cn from "classnames";

import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";

import type { HostDescriptionFormFields } from "../../model/types/hostDescription";

import { HostDescriptionOrganization } from "../HostDescriptionOrganization/HostDescriptionOrganization";
import { HostDescriptionAddress } from "../HostDescriptionAddress/HostDescriptionAddress";
import { HostDescriptionSocial } from "../HostDescriptionSocial/HostDescriptionSocial";

import styles from "./HostDescriptionForm.module.scss";

interface HostDescriptionFormProps {
    className?: string;
}

export const HostDescriptionForm = memo((props: HostDescriptionFormProps) => {
    const { className } = props;

    const onSubmit: SubmitHandler<HostDescriptionFormFields> = (data) => {};

    const form = useForm<HostDescriptionFormFields>({ mode: "onChange" });

    const { handleSubmit } = form;

    return (
        <FormProvider {...form}>
            <form className={cn(styles.form, className)} onSubmit={handleSubmit(onSubmit)}>
                <HostDescriptionAddress />
                <HostDescriptionOrganization />
                <HostDescriptionSocial />
            </form>
        </FormProvider>
    );
});
