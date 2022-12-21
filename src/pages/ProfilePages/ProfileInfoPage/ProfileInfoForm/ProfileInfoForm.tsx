import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/ui/Button/Button";

import AboutFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/AboutFormGroup/AboutFormGroup";
import ContactsFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ContactsFormGroup/ContactsFormGroup";
import DateOfBirthFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/DateOfBirthFormGroup/DateOfBirthFormGroup";
import GenderFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GenderFormGroup/GenderFormGroup";
import GeneralFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/GeneralFormGroup/GeneralFormGroup";
import LocationFormGroup from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/LocationFormGroup/LocationFormGroup";

import { userInfoApi } from "@/store/api/userInfoApi";

import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    isLocked: boolean;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked }) => {
    const { data: userInfo, isLoading } = userInfoApi.useGetUserInfoQuery();

    const { control, handleSubmit } = useForm({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
    };

    if (isLoading) {
        return <h1>Data loading...</h1>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <GeneralFormGroup control={control} isLocked={isLocked} />
            <DateOfBirthFormGroup control={control} isLocked={isLocked} />
            <GenderFormGroup control={control} isLocked={isLocked} />
            <LocationFormGroup control={control} isLocked={isLocked} />
            <ContactsFormGroup
                data={{ email: userInfo!.email, phoneNumber: null }}
                control={control}
                isLocked={isLocked}
            />
            <AboutFormGroup control={control} isLocked={isLocked} />
            <Button
                type={"submit"}
                variant={"primary"}
                className={styles.button}
            >
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileInfoForm;
