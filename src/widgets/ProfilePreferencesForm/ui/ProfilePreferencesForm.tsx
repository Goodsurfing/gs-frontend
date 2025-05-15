import React, { FC, useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";

import { Activity } from "@/features/ProfilePreferences";

import Button from "@/shared/ui/Button/Button";

import { ProfilePreferencesField } from "../model/types/profilePreferences";
import { profilePreferencesAdapter, profilePreferencesApiAdapter } from "../lib/profilePreferencesAdapter";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";
import styles from "./ProfilePreferencesForm.module.scss";

const defaultValues: DefaultValues<ProfilePreferencesField> = {
    favoriteCategories: [],
};

interface ProfilePreferencesFormProps {
    profileId: string;
}

export const ProfilePreferencesForm: FC<ProfilePreferencesFormProps> = (props) => {
    const { profileId } = props;
    const { handleSubmit, reset, control } = useForm<ProfilePreferencesField>({
        mode: "onChange",
        defaultValues,
    });

    const [toast, setToast] = useState<ToastAlert>();
    const { data: profileData } = useGetProfileInfoQuery();
    const [updateProfile] = useUpdateProfileInfoMutation();

    useEffect(() => {
        if (profileData) {
            const preparedData = profilePreferencesAdapter(profileData);
            reset(preparedData);
        }
    }, [reset, profileData]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = profilePreferencesApiAdapter(data);
        try {
            await updateProfile({ userId: profileId, profileData: preparedData }).unwrap();
            setToast({
                text: "Данные успешно изменены",
                type: HintType.Success,
            });
        } catch (error) {
            setToast({
                text: getErrorText(error),
                type: HintType.Error,
            });
        }
    });

    return (
        <form onSubmit={onSubmit} className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {/* Functionality cut out */}
            {/* <PopularPlaces /> */}
            {/* <AcrossRussia /> */}
            {/* <InputSelectedCountries /> */}
            <Controller
                name="favoriteCategories"
                control={control}
                render={({ field }) => (
                    <Activity value={field.value} onChange={field.onChange} />
                )}
            />
            <Button
                type="submit"
                color="BLUE"
                size="MEDIUM"
                variant="FILL"
                onClick={onSubmit}
                className={styles.button}
            >
                Сохранить
            </Button>
        </form>
    );
};
