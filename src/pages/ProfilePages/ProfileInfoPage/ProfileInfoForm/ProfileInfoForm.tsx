import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/ui/Button/Button";

import ContactsFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ContactsFormGroup/ContactsFormGroup";
import GenderFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GenderFormGroup/GenderFormGroup";
import GeneralFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GeneralFormGroup/GeneralFormGroup";

import { getChangedFieldsOnly } from "@/utils/common/getChangedFieldsOnly";

import { userInfoApi } from "@/store/api/userInfoApi";

import { IUserInfo } from "./ProfileInfoForm.interface";
import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    isLocked: boolean;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked }) => {
    const { data: userInfo, isLoading } = userInfoApi.useGetUserInfoQuery();

    const { control, handleSubmit, formState } = useForm<IUserInfo>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<IUserInfo> = (data: IUserInfo) => {
        const prepareData: Partial<IUserInfo> = getChangedFieldsOnly(
            data,
            formState.dirtyFields,
        );
        console.log(prepareData);
    };

    if (isLoading) {
        return <h1>Data loading...</h1>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <GeneralFormGroup
                data={{ firstName: "rav", lastName: "shar" }}
                control={control}
                isLocked={isLocked}
            />
            <GenderFormGroup
                data={{ gender: "male" }}
                control={control}
                isLocked={isLocked}
            />
            <ContactsFormGroup
                data={{ email: userInfo!.email }}
                control={control}
                isLocked={isLocked}
            />
            <Button type="submit" variant="primary" className={styles.button}>
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileInfoForm;
