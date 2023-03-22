import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import HintPopup from "@/components/HintPopup/HintPopup";
import { HintType } from "@/components/HintPopup/HintPopup.interface";
import ProfileInput from "@/components/ProfileInput/ProfileInput";
import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import { organizationApi } from "@/store/api/organizationApi";

import { IOrganizationRegistrationFormData } from "@/types/api/organization/organizationRegistration.interface";

import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";

const HostMainInfoForm: FC = () => {
    const [registerOrganization] = organizationApi.useRegisterOrganizationMutation();

    console.log(registerOrganization)

    const [file, setFile] = useState<File>();

    const onSubmit: SubmitHandler<IOrganizationRegistrationFormData> = async (
        data
    ) => {
        const preparedData: IOrganizationRegistrationFormData = {
            name: data.name,
            description: data.description,
        };
        try {
            await registerOrganization(preparedData)
                .unwrap()
                .then((response) => {
                    console.log(response);
                });
        } catch (e) {
            console.log(e);
            if (e instanceof Error) {
                console.log(e.message);
            }
        }
    };

    const { control, handleSubmit } =
        useForm<IOrganizationRegistrationFormData>({
            mode: "onChange",
        });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {/* {isSuccess && <HintPopup type={isSuccess ? HintType.Success : HintType.Error} text="Работает" />} */}
            <div className={styles.container}>
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
            </div>
            <ProfileInput
                fileClassname={styles.fileInput}
                className={styles.file}
                id="host-file"
                file={file}
                setFile={setFile}
                route="/profile/info"
            />
        </form>
    );
};

export default React.memo(HostMainInfoForm);
