import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { Submenu } from "@/widgets/Submenu";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useGetVolunteerByIdQuery } from "@/entities/Volunteer";

import {
    getMessengerPageUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { SubmenuVolunteerData } from "../../model/data/submenuData";
import { VolunteerHeaderCard } from "../VolunteerHeaderCard/VolunteerHeaderCard";
import { VolunteerPageContent } from "../VolunteerPageContent/VolunteerPageContent";
import styles from "./VolunteerPersonalPage.module.scss";

export const VolunteerPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const { data: volunteerData, isLoading } = useGetVolunteerByIdQuery(
        id || "",
    );
    const { data: myProfileData, isLoading: myProfileIsLoading } = useGetProfileInfoQuery();

    const handleEditClick = useCallback(() => {
        navigate(getVolunteerDashboardPageUrl(locale));
    }, [locale, navigate]);

    const handleMessageClick = useCallback(() => {
        navigate(getMessengerPageUrl(locale));
    }, [locale, navigate]);

    if (isLoading || myProfileIsLoading || !myProfileData || !volunteerData) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Произошла ошибка"
                    />
                </div>
                <Footer />
            </div>
        );
    }

    const showButtons = myProfileData.id === id;

    const renderButtons = showButtons ? (
        <Button
            size="SMALL"
            color="BLUE"
            variant="FILL"
            className={styles.button}
            onClick={handleEditClick}
        >
            Редактировать
        </Button>

    ) : (
        <Button
            size="SMALL"
            color="BLUE"
            variant="OUTLINE"
            className={styles.button}
            onClick={handleMessageClick}
        >
            Написать
        </Button>
    );

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <VolunteerHeaderCard
                    volunteer={volunteerData}
                    showButtons={showButtons}
                    locale={locale}
                />
                <Submenu
                    className={styles.navMenu}
                    items={SubmenuVolunteerData}
                    buttons={renderButtons}
                />
                <VolunteerPageContent volunteer={volunteerData} />
            </div>
            <Footer />
        </div>
    );
};
