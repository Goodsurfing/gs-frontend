import { skipToken } from "@reduxjs/toolkit/dist/query";
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

import { OrganizationType } from "@/types/api/organization";
import { IOrganizationRegistrationParams } from "@/types/api/organization/organizationRegistration.interface";

import { IHostInfoForm } from "./HostMainInfoForm.interface";
import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";

const HostMainInfoForm: FC = () => {
    const [getInfo, userResults] = userInfoApi.useLazyGetUserInfoQuery();
    const [getOrganization, organizationResults] =
        userOrganizationInfoApi.useLazyGetUserOrganizationInfoQuery();

    const [savedOrganizationData, setSavedOrganizationData] =
        useState<OrganizationType>();

    useEffect(() => {
        getInfo().then((userInfo) => {
            if (
                userInfo.data?.organizations &&
                userInfo.data.organizations.length > 0
            ) {
                const organizationId = userInfo.data.organizations[0].id;
                getOrganization(organizationId).then((res) => {
                    if (res.data) {
                        const savedData: OrganizationType = {
                            name: res.data.name,
                            description: res.data.description,
                            address: res.data.address,
                            vk: res.data.vk,
                            instagram: res.data.instagram,
                            facebook: res.data.facebook,
                            telegram: res.data.telegram,
                            type: res.data.type,
                            website: res.data.website,
                        };
                        setSavedOrganizationData(savedData);
                    }
                });
            } else {
                const savedData: OrganizationType = {
                    name: '',
                    description: '',
                    address: '',
                    vk: '',
                    instagram: '',
                    facebook: '',
                    telegram: '',
                    type: '',
                    website: '',
                };
                setSavedOrganizationData(savedData);
            }
        });
    }, []);

    const [registerOrganization, { isError }] =
        organizationApi.useRegisterOrganizationMutation();
    const [bindOrganization, { isSuccess }] =
        organizationApi.useBindOrganizationMutation();

    const [hint, setHint] = useState<Pick<IHintPopup, "text" | "type">>();
    const [file, setFile] = useState<File>();

    const onSubmit: SubmitHandler<IHostInfoForm> = async (data) => {
        const preparedData: IOrganizationRegistrationParams = {
            name: data.name,
            description: data.description,
            address: data.address,
            vk: data.vk,
            instagram: data.instagram,
            facebook: data.facebook,
            telegram: data.telegram,
            type: data.type,
            website: data.website,
        };
        registerOrganization(preparedData)
            .unwrap()
            .then((organization) => {
                bindOrganization({
                    uuid: organization.id,
                    name: organization.name,
                    description: organization.description,
                    address: organization.address,
                    vk: organization.vk,
                    instagram: organization.instagram,
                    facebook: organization.facebook,
                    telegram: organization.telegram,
                    type: organization.type,
                    website: organization.website,
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

    if (organizationResults.isLoading) {
        return (
            <div>
                <p>Data is loading...</p>
            </div>
        );
    }

    if (organizationResults.isError) {
        return (
            <div><p>Произошла ошибка!</p></div>
        )
    }

    if (savedOrganizationData) {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
                {isError && hint && (
                        <HintPopup type={hint.type} text={hint.text} />
                    )}
                    {isSuccess && hint && (
                        <HintPopup type={HintType.Success} text={"Успешно!"} />
                    )}
                <div className={styles.container}>
                    <YMapWithAddress
                        data={{
                            address: savedOrganizationData.address,
                        }}
                        control={control}
                    />
                    <HostMainInfoOrganization
                        data={{
                            name: savedOrganizationData.name,
                            description: savedOrganizationData.description,
                            type: savedOrganizationData.type,
                            website: savedOrganizationData.website,
                        }}
                        control={control}
                    />
                    <HostMainInfoSocial
                        data={{
                            vk: savedOrganizationData.vk,
                            facebook: savedOrganizationData.facebook,
                            telegram: savedOrganizationData.telegram,
                            instagram: savedOrganizationData.instagram,
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
    }

    return null;
};

export default React.memo(HostMainInfoForm);
