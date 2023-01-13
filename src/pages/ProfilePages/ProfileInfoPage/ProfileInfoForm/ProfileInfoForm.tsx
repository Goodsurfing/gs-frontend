import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/ui/Button/Button";

import ContactsFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ContactsFormGroup/ContactsFormGroup";
import GenderFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GenderFormGroup/GenderFormGroup";
import GeneralFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GeneralFormGroup/GeneralFormGroup";

import useUploadFile from "@/hooks/files/useUploadFile";
import { useAppSelector } from "@/hooks/redux";

import { convertFileToBinary } from "@/utils/files/convertFileToBinary";

import { userInfoApi } from "@/store/api/userInfoApi";

import { IUserInfo } from "./ProfileInfoForm.interface";
import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    isLocked: boolean;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked }) => {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = userInfoApi.useGetUserInfoQuery();

    const [updateUserInfo] = userInfoApi.usePutUserInfoMutation();

    const { control, handleSubmit } = useForm<IUserInfo>({
        mode: "onChange",
    });

    const [data, setData] = useState<IUserInfo | null>(null);

    const onSubmit: SubmitHandler<IUserInfo> = async (data) => {
        setData(data);
    };

    const { token } = useAppSelector((state) => { return state.login; });

    async function handleUpdateUserInfo() {
        const profileImage = data?.image[0];
        if (!data) return;
        const { image, ...otherData } = data;
        if (!image) {
            otherData.imageUuid = userInfo?.image.id;
            return updateUserInfo(otherData);
        }

        const binaryImage = convertFileToBinary(profileImage);
        const imageUuid = await useUploadFile(
            profileImage?.name,
            binaryImage,
            token,
        );
        otherData.imageUuid = imageUuid;
        return updateUserInfo(otherData);
    }

    useEffect(() => {
        handleUpdateUserInfo();
    }, [data]);

    if (isLoading) {
        return <h1>Data loading...</h1>;
    }

    if (isSuccess && userInfo) {
        return (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
                <GeneralFormGroup
                    data={{
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        image: userInfo.image,
                    }}
                    control={control}
                    isLocked={isLocked}
                />
                <GenderFormGroup
                    data={{ gender: userInfo.gender }}
                    control={control}
                    isLocked={isLocked}
                />
                <ContactsFormGroup
                    data={{ email: userInfo.email }}
                    control={control}
                    isLocked={isLocked}
                />
                <Button
                    type="submit"
                    variant="primary"
                    className={styles.button}
                >
                    Сохранить
                </Button>
            </form>
        );
    }

    return null;
};

export default ProfileInfoForm;
