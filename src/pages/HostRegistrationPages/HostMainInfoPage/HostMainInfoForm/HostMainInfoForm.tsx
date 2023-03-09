import { Form } from "@/hoc/Form/Form";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";
import Input from "@/components/ui/Input/Input";

import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";
import { organizationApi } from "@/store/api/organizationApi";
import { useAppDispatch } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { IOrganizationRegistrationFormData } from "@/types/api/organization/organizationRegistration.interface";

const HostMainInfoForm: FC = () => {
    const [registerOrganization] = organizationApi.useRegisterOrganizationMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IOrganizationRegistrationFormData> = async (data) => {
        const preparedData: IOrganizationRegistrationFormData = {
            name: data.name,
            description: data.description
        }
        try {
            await registerOrganization(preparedData)
            .unwrap()
            .then((response) => {
                console.log(response)
            })

        } catch (e) {
            console.log(e);
        }
    };

    const { control, reset, handleSubmit } = useForm<IOrganizationRegistrationFormData>({
        mode: "onChange",
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <YMapWithAddress control={control} />
            <HostMainInfoOrganization control={control} />
            <HostMainInfoSocial control={control} />
            <Button
                className={styles.button}
                variant={Variant.PRIMARY}
                rounded={true}
                type="submit"
            >
                Сохранить
            </Button>
        </form>
    );
};

export default React.memo(HostMainInfoForm);
