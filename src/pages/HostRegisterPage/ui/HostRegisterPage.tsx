import { FC, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HostDescriptionForm } from "@/features/HostDescription";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { getHostInfoUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./HostRegisterPage.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import MainHeader from "@/widgets/MainHeader/MainHeader";

const HostRegisterPage: FC = () => {
    const { t, ready } = useTranslation("host");
    const { ready: profileIsReady } = useTranslation("profile");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        data: myProfile, isLoading, isError, refetch: profileRefetch,
    } = useGetProfileInfoQuery();

    useEffect(() => {
        if (myProfile && myProfile.hostId) {
            navigate(getHostInfoUrl(locale));
        }
    }, [myProfile, navigate, locale]);

    const handleCreateSuccess = () => {
        timeoutRef.current = setTimeout(() => {
            navigate(getHostInfoUrl(locale));
        }, 2000);
    };

    useEffect(() => () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    if (!ready || !profileIsReady) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    return (
        <>
            <MainHeader />
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{t("hostDescription.Создание организации")}</h2>
                <HostDescriptionForm
                    onCreateSuccess={handleCreateSuccess}
                    className={styles.className}
                    host={myProfile?.hostId}
                    myProfile={myProfile}
                    isLoading={isLoading}
                    isError={isError}
                    profileRefetch={profileRefetch}
                />
            </div>
        </>
    );
};

export default HostRegisterPage;
