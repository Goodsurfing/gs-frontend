import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { Activity } from "@/features/ProfilePreferences";

import Button from "@/shared/ui/Button/Button";

import { ProfilePreferencesField } from "../model/types/profilePreferences";
import { profilePreferencesAdapter, profilePreferencesApiAdapter } from "../lib/profilePreferencesAdapter";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getErrorText } from "@/shared/lib/getErrorText";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { useGetProfileInfoQuery, useUpdateProfilePreferencesMutation } from "@/entities/Profile";
import styles from "./ProfilePreferencesForm.module.scss";

const defaultValues: DefaultValues<ProfilePreferencesField> = {
    favoriteCategories: [],
};

export const ProfilePreferencesForm = () => {
    const { handleSubmit, reset, control } = useForm<ProfilePreferencesField>({
        mode: "onChange",
        defaultValues,
    });
    const { t } = useTranslation("profile");

    const [toast, setToast] = useState<ToastAlert>();
    const { data: profileData } = useGetProfileInfoQuery();
    const [updateProfilePreferences, { isLoading }] = useUpdateProfilePreferencesMutation();

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
            await updateProfilePreferences(preparedData).unwrap();
            setToast({
                text: t("preferences.Данные успешно изменены"),
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
                disabled={isLoading}
            >
                {t("preferences.Сохранить")}
            </Button>
        </form>
    );
};
