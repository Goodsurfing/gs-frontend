import { FC } from "react";

import { SideMenuData } from "@/shared/data/sidebar/profile-pages";

import { profileActions, profileApi, useUser } from "@/entities/Profile";

import { ProfileInfoForm, ProfileInfoFields } from "@/features/ProfileInfo";

import { PageLayout } from "@/widgets/PageLayout";

import { ProfileInfoReadonlyButton } from "../ProfileInfoReadonlyButton/ProfileInfoReadonlyButton";

import styles from "./ProfileInfoPage.module.scss";
import { useAppDispatch } from "@/shared/hooks/redux";
import { profileFormApiAdapter } from "../../lib/profileFormApiAdapter";

const ProfileInfoPage: FC = () => {
    const { error, isLoading, profile } = useUser();

    const [updateProfile, { data, isLoading, error }] = profileApi.useUpdateProfileInfoMutation();

    const dispatch = useAppDispatch();

    const onFormSubmit = (formData: ProfileInfoFields) => {
        dispatch(profileActions.setReadonly(true));
        updateProfile(profileFormApiAdapter(formData));
    };

    return (
        <PageLayout wrapperClassName={styles.layout} sidebarContent={SideMenuData}>
            <main className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Основная информация</h2>
                    <ProfileInfoReadonlyButton />
                </div>
                <ProfileInfoForm
                    profileInfo={profile}
                    isLoading={isLoading}
                    error={error}
                    className={styles.form}
                    onSuccess={onFormSubmit}
                />
            </main>
        </PageLayout>
    );
};

export default ProfileInfoPage;
