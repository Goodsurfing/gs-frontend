import React, { FC, useEffect, useState } from "react";
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
import { userInfoApi } from "@/store/api/userInfoApi";
import { userOrganizationInfoApi } from "@/store/api/userOrganizationInfoApi";

import { IOrganizationRegistrationFormData } from "@/types/api/organization/organizationRegistration.interface";

import { IHostInfoForm } from "./HostMainInfoForm.interface";
import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";

const HostMainInfoForm: FC = () => {
    const { data: userInfo } = userInfoApi.useGetUserInfoQuery();
    const { data: userOrganizationInfo } =
        userOrganizationInfoApi.useGetUserOrganizationInfoQuery(
            userInfo?.organizations[0].id!,
            { skip: userInfo?.organizations[0].id ? false : true }
        );

    if (userOrganizationInfo) {
        console.log(userOrganizationInfo);
    }

    const [registerOrganization, { isError }] =
        organizationApi.useRegisterOrganizationMutation();
    const [bindOrganization, { isSuccess }] =
        organizationApi.useBindOrganizationMutation();

    const [hint, setHint] = useState<Pick<IHintPopup, "text" | "type">>();
    const [file, setFile] = useState<File>();

    const onSubmit: SubmitHandler<IHostInfoForm> = async (data) => {
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
                    setHint({
                        text: "Не удалось привязать организацию",
                        type: HintType.Error,
                    });
                    console.error("Не удалось привязать организацию");
                });
            })
            .catch((reason) => {
                console.error("Не удалось создать организацию");
                setHint({
                    text: "Не удалось создать организацию",
                    type: HintType.Error,
                });
            });
    };

    const { control, handleSubmit } = useForm<IHostInfoForm>({
        mode: "onChange",
    });

    if (!userOrganizationInfo) {
        return <div>Data is loading...</div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {isError && hint && <HintPopup type={hint.type} text={hint.text} />}
            {isSuccess && hint && (
                <HintPopup type={HintType.Success} text={"Успешно!"} />
            )}
            <div className={styles.container}>
                <YMapWithAddress
                    data={{
                        address: userOrganizationInfo.address,
                    }}
                    control={control}
                />
                <HostMainInfoOrganization
                    data={{
                        name: userOrganizationInfo.name,
                        description: userOrganizationInfo.description,
                        type: userOrganizationInfo.type,
                        website: userOrganizationInfo.website,
                    }}
                    control={control}
                />
                <HostMainInfoSocial
                    data={{
                        vk: userOrganizationInfo.vk,
                        facebook: userOrganizationInfo.facebook,
                        telegram: userOrganizationInfo.telegram,
                        instagram: userOrganizationInfo.instagram,
                    }}
                    control={control}
                />
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
