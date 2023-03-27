import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import HintPopup from "@/components/HintPopup/HintPopup";
import {
    HintType,
    IHintPopup,
} from "@/components/HintPopup/HintPopup.interface";
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
    const [registerOrganization, { isError }] =
        organizationApi.useRegisterOrganizationMutation();
    const [bindOrganization, { isSuccess }] =
        organizationApi.useBindOrganizationMutation();

    const [hint, setHint] = useState<Pick<IHintPopup, "text" | "type">>();
    const [file, setFile] = useState<File>();

    const onSubmit: SubmitHandler<IOrganizationRegistrationFormData> = async (
        data
    ) => {
        const preparedData: IOrganizationRegistrationFormData = {
            name: data.name,
            description: data.description,
        };
        registerOrganization(preparedData)
            .unwrap()
            .then((organization) => {
                bindOrganization({
                    uuid: organization.id,
                    name: organization.name,
                    description: organization.description,
                }).catch((error) => {
                    setHint({text: "Не удалось привязать организацию", type: HintType.Error})
                    console.error("Не удалось привязать организацию")}
                );
            })
            .catch((reason) => {
                console.error("Не удалось создать организацию")
                setHint({text: "Не удалось создать организацию", type: HintType.Error})
            });
    };

    const { control, handleSubmit } =
        useForm<IOrganizationRegistrationFormData>({
            mode: "onChange",
        });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {isError && hint && <HintPopup type={hint.type} text={hint.text} />}
            {isSuccess && hint && <HintPopup type={HintType.Success} text={'Успешно!'} />}
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
